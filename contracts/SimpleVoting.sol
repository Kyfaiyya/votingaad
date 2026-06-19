// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleVoting {

    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    struct Election {
        uint256 id;
        string title;
        uint256 deadline;
        bool active;
        uint256 candidateCount;
        uint256 totalVotes;
        mapping(uint256 => Candidate) candidates;
        mapping(address => bool) hasVoted;
    }

    address public owner;
    uint256 public electionCount;
    mapping(uint256 => Election) public elections;

    event ElectionCreated(uint256 electionId, string title);
    event CandidateAdded(uint256 electionId, uint256 candidateId, string name);
    event Voted(uint256 electionId, uint256 candidateId, address voter);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier electionExists(uint256 _electionId) {
        require(_electionId > 0 && _electionId <= electionCount, "Election not found");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createElection(string memory _title, uint256 _durationMinutes) public onlyOwner {
        require(bytes(_title).length > 0, "Title empty");

        electionCount++;
        Election storage e = elections[electionCount];
        e.id = electionCount;
        e.title = _title;
        e.deadline = block.timestamp + (_durationMinutes * 1 minutes);
        e.active = true;

        emit ElectionCreated(electionCount, _title);
    }

    function addCandidate(uint256 _electionId, string memory _name) public onlyOwner electionExists(_electionId) {
        Election storage e = elections[_electionId];
        require(e.active, "Election closed");
        require(bytes(_name).length > 0, "Candidate name cannot be empty");

        e.candidateCount++;
        e.candidates[e.candidateCount] = Candidate(e.candidateCount, _name, 0);

        emit CandidateAdded(_electionId, e.candidateCount, _name);
    }

    function vote(uint256 _electionId, uint256 _candidateId) public electionExists(_electionId) {
        Election storage e = elections[_electionId];
        require(block.timestamp <= e.deadline, "Voting ended");
        require(!e.hasVoted[msg.sender], "Already voted");
        require(_candidateId > 0 && _candidateId <= e.candidateCount, "Invalid candidate");

        e.hasVoted[msg.sender] = true;
        e.candidates[_candidateId].voteCount++;
        e.totalVotes++;

        emit Voted(_electionId, _candidateId, msg.sender);
    }

    function getCandidate(uint256 _electionId, uint256 _candidateId) public view returns (uint256, string memory, uint256) {
        Election storage e = elections[_electionId];
        Candidate storage c = e.candidates[_candidateId];
        return (c.id, c.name, c.voteCount);
    }

    function getElection(uint256 _electionId) public view returns (string memory, uint256, bool, uint256, uint256) {
        Election storage e = elections[_electionId];
        return (e.title, e.deadline, e.active, e.candidateCount, e.totalVotes);
    }

    function getWinner(uint256 _electionId) public view returns (string memory winnerName, uint256 highestVote, bool isTie) {
        Election storage e = elections[_electionId];
        highestVote = 0;
        uint256 winnerId = 0;
        isTie = false;

        for(uint256 i = 1; i <= e.candidateCount; i++) {
            if(e.candidates[i].voteCount > highestVote) {
                highestVote = e.candidates[i].voteCount;
                winnerId = i;
                isTie = false;
            } else if (e.candidates[i].voteCount == highestVote && highestVote > 0) {
                isTie = true;
            }
        }

        if (winnerId != 0) {
            winnerName = e.candidates[winnerId].name;
        } else {
            winnerName = "No votes yet";
        }

        return (winnerName, highestVote, isTie);
    }

    function hasVoted(uint256 _electionId, address _voter) public view returns (bool) {
        Election storage e = elections[_electionId];
        return e.hasVoted[_voter];
    }
}
