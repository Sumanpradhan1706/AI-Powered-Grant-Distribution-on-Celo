// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title GrantDistribution
 * @dev AI-Powered Grant Distribution on Celo
 * @notice Smart contract for automated grant distribution based on AI-calculated impact scores
 */
contract GrantDistribution is Ownable, ReentrancyGuard {
    
    // Structs
    struct Project {
        address payable projectAddress;
        string name;
        string description;
        string githubUrl;
        uint256 impactScore;
        uint256 totalGrantsReceived;
        uint256 lastUpdated;
        bool isActive;
        bool isVerified;
    }
    
    struct Grant {
        uint256 projectId;
        uint256 amount;
        uint256 timestamp;
        address token;
        string reason;
    }
    
    // State variables
    mapping(uint256 => Project) public projects;
    mapping(address => uint256[]) public projectsByAddress;
    mapping(uint256 => Grant[]) public projectGrants;
    
    uint256 public projectCount;
    uint256 public totalDistributed;
    uint256 public minimumImpactScore = 50; // Minimum score to be eligible
    
    address public cUSDToken;
    address public aiOracle; // Address authorized to update impact scores
    
    // Events
    event ProjectRegistered(
        uint256 indexed projectId,
        address indexed projectAddress,
        string name,
        uint256 timestamp
    );
    
    event ImpactScoreUpdated(
        uint256 indexed projectId,
        uint256 oldScore,
        uint256 newScore,
        uint256 timestamp
    );
    
    event GrantDistributed(
        uint256 indexed projectId,
        address indexed recipient,
        uint256 amount,
        address token,
        string reason,
        uint256 timestamp
    );
    
    event ProjectVerified(uint256 indexed projectId, uint256 timestamp);
    
    event TreasuryDeposit(address indexed from, uint256 amount, address token);
    
    // Modifiers
    modifier onlyAIOracle() {
        require(msg.sender == aiOracle, "Only AI Oracle can call this");
        _;
    }
    
    modifier projectExists(uint256 _projectId) {
        require(_projectId < projectCount, "Project does not exist");
        _;
    }
    
    constructor(address _cUSDToken) Ownable(msg.sender) {
        cUSDToken = _cUSDToken;
        aiOracle = msg.sender;
    }
    
    /**
     * @dev Register a new project for grant consideration
     */
    function registerProject(
        string memory _name,
        string memory _description,
        string memory _githubUrl
    ) external returns (uint256) {
        uint256 projectId = projectCount;
        
        projects[projectId] = Project({
            projectAddress: payable(msg.sender),
            name: _name,
            description: _description,
            githubUrl: _githubUrl,
            impactScore: 0,
            totalGrantsReceived: 0,
            lastUpdated: block.timestamp,
            isActive: true,
            isVerified: false
        });
        
        projectsByAddress[msg.sender].push(projectId);
        projectCount++;
        
        emit ProjectRegistered(projectId, msg.sender, _name, block.timestamp);
        
        return projectId;
    }
    
    /**
     * @dev Update impact score for a project (called by AI Oracle)
     */
    function updateImpactScore(
        uint256 _projectId,
        uint256 _newScore
    ) external onlyAIOracle projectExists(_projectId) {
        Project storage project = projects[_projectId];
        uint256 oldScore = project.impactScore;
        
        project.impactScore = _newScore;
        project.lastUpdated = block.timestamp;
        
        emit ImpactScoreUpdated(_projectId, oldScore, _newScore, block.timestamp);
    }
    
    /**
     * @dev Batch update impact scores for multiple projects
     */
    function batchUpdateScores(
        uint256[] memory _projectIds,
        uint256[] memory _scores
    ) external onlyAIOracle {
        require(_projectIds.length == _scores.length, "Array lengths must match");
        
        for (uint256 i = 0; i < _projectIds.length; i++) {
            if (_projectIds[i] < projectCount) {
                Project storage project = projects[_projectIds[i]];
                uint256 oldScore = project.impactScore;
                project.impactScore = _scores[i];
                project.lastUpdated = block.timestamp;
                
                emit ImpactScoreUpdated(_projectIds[i], oldScore, _scores[i], block.timestamp);
            }
        }
    }
    
    /**
     * @dev Distribute grants to top projects automatically
     */
    function distributeGrants(
        uint256[] memory _projectIds,
        uint256[] memory _amounts,
        string[] memory _reasons
    ) external onlyOwner nonReentrant {
        require(
            _projectIds.length == _amounts.length && _amounts.length == _reasons.length,
            "Array lengths must match"
        );
        
        IERC20 token = IERC20(cUSDToken);
        
        for (uint256 i = 0; i < _projectIds.length; i++) {
            require(_projectIds[i] < projectCount, "Invalid project ID");
            
            Project storage project = projects[_projectIds[i]];
            require(project.isActive, "Project is not active");
            require(project.impactScore >= minimumImpactScore, "Impact score too low");
            
            require(
                token.transfer(project.projectAddress, _amounts[i]),
                "Transfer failed"
            );
            
            project.totalGrantsReceived += _amounts[i];
            totalDistributed += _amounts[i];
            
            projectGrants[_projectIds[i]].push(Grant({
                projectId: _projectIds[i],
                amount: _amounts[i],
                timestamp: block.timestamp,
                token: cUSDToken,
                reason: _reasons[i]
            }));
            
            emit GrantDistributed(
                _projectIds[i],
                project.projectAddress,
                _amounts[i],
                cUSDToken,
                _reasons[i],
                block.timestamp
            );
        }
    }
    
    /**
     * @dev Verify a project (adds credibility)
     */
    function verifyProject(uint256 _projectId) 
        external 
        onlyOwner 
        projectExists(_projectId) 
    {
        projects[_projectId].isVerified = true;
        emit ProjectVerified(_projectId, block.timestamp);
    }
    
    /**
     * @dev Deposit funds to treasury
     */
    function depositToTreasury(uint256 _amount) external {
        IERC20 token = IERC20(cUSDToken);
        require(
            token.transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );
        
        emit TreasuryDeposit(msg.sender, _amount, cUSDToken);
    }
    
    /**
     * @dev Update AI Oracle address
     */
    function updateAIOracle(address _newOracle) external onlyOwner {
        aiOracle = _newOracle;
    }
    
    /**
     * @dev Update minimum impact score
     */
    function updateMinimumScore(uint256 _newScore) external onlyOwner {
        minimumImpactScore = _newScore;
    }
    
    /**
     * @dev Get project details
     */
    function getProject(uint256 _projectId) 
        external 
        view 
        projectExists(_projectId) 
        returns (Project memory) 
    {
        return projects[_projectId];
    }
    
    /**
     * @dev Get all grants for a project
     */
    function getProjectGrants(uint256 _projectId) 
        external 
        view 
        projectExists(_projectId) 
        returns (Grant[] memory) 
    {
        return projectGrants[_projectId];
    }
    
    /**
     * @dev Get projects by address
     */
    function getProjectsByAddress(address _address) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return projectsByAddress[_address];
    }
    
    /**
     * @dev Get treasury balance
     */
    function getTreasuryBalance() external view returns (uint256) {
        return IERC20(cUSDToken).balanceOf(address(this));
    }
    
    /**
     * @dev Get top projects by impact score
     */
    function getTopProjects(uint256 _limit) 
        external 
        view 
        returns (uint256[] memory, uint256[] memory) 
    {
        uint256[] memory projectIds = new uint256[](_limit);
        uint256[] memory scores = new uint256[](_limit);
        
        // Simple sorting logic - for production, consider off-chain sorting
        for (uint256 i = 0; i < projectCount && i < _limit; i++) {
            projectIds[i] = i;
            scores[i] = projects[i].impactScore;
        }
        
        return (projectIds, scores);
    }
    
    /**
     * @dev Emergency withdraw (only owner)
     */
    function emergencyWithdraw(address _token, uint256 _amount) 
        external 
        onlyOwner 
    {
        IERC20(_token).transfer(owner(), _amount);
    }
}
