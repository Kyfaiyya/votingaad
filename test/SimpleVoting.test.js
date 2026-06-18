const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleVoting", function () {
  let voting;
  let owner;
  let voter1;
  let voter2;

  beforeEach(async function () {
    [owner, voter1, voter2] = await ethers.getSigners();
    const Voting = await ethers.getContractFactory("SimpleVoting");
    voting = await Voting.deploy();
    await voting.waitForDeployment();
  });

  it("1. Should create election", async function () {
    await voting.createElection("Ketua BEM", 60);
    const election = await voting.getElection(1);
    expect(election[0]).to.equal("Ketua BEM");
  });

  it("2. Should add candidate", async function () {
    await voting.createElection("Voting", 60);
    await voting.addCandidate(1, "Alice");
    const candidate = await voting.getCandidate(1, 1);
    expect(candidate[1]).to.equal("Alice");
  });

  it("3. Should reject empty election title", async function () {
    await expect(voting.createElection("", 60)).to.be.revertedWith(
      "Title empty",
    );
  });

  it("4. Should reject empty candidate name", async function () {
    await voting.createElection("Voting", 60);
    await expect(voting.addCandidate(1, "")).to.be.revertedWith(
      "Candidate name cannot be empty",
    );
  });

  it("5. Should reject missing election", async function () {
    await expect(voting.addCandidate(1, "Alice")).to.be.revertedWith(
      "Election not found",
    );
  });

  it("6. Should commit vote", async function () {
    await voting.createElection("Voting", 60);
    await voting.addCandidate(1, "Alice");
    const secret = "secret123";
    const hash = ethers.keccak256(
      ethers.solidityPacked(["uint256", "string"], [1, secret]),
    );

    await voting.connect(voter1).commitVote(1, hash);
    const election = await voting.getElection(1);
    expect(election[4]).to.equal(0);
  });

  it("7. Should reveal vote", async function () {
    await voting.createElection("Voting", 60);
    await voting.addCandidate(1, "Alice");
    const secret = "secret123";
    const hash = ethers.keccak256(
      ethers.solidityPacked(["uint256", "string"], [1, secret]),
    );

    await voting.connect(voter1).commitVote(1, hash);
    await voting.connect(voter1).revealVote(1, 1, secret);

    const candidate = await voting.getCandidate(1, 1);
    expect(candidate[2]).to.equal(1);
  });

  it("8. Should reject invalid reveal (Negative Test)", async function () {
    await voting.createElection("Voting", 60);
    await voting.addCandidate(1, "Alice");
    const secret = "secret123";
    const hash = ethers.keccak256(
      ethers.solidityPacked(["uint256", "string"], [1, secret]),
    );

    await voting.connect(voter1).commitVote(1, hash);
    await expect(
      voting.connect(voter1).revealVote(1, 1, "wrongsecret"),
    ).to.be.revertedWith("Invalid reveal");
  });

  it("9. Should reject invalid candidate reveal", async function () {
    await voting.createElection("Voting", 60);
    await voting.addCandidate(1, "Alice");
    const secret = "secret123";
    const hash = ethers.keccak256(
      ethers.solidityPacked(["uint256", "string"], [1, secret]),
    );

    await voting.connect(voter1).commitVote(1, hash);
    await expect(
      voting.connect(voter1).revealVote(1, 2, secret),
    ).to.be.revertedWith("Invalid candidate");
  });

  it("10. Should reject double reveal", async function () {
    await voting.createElection("Voting", 60);
    await voting.addCandidate(1, "Alice");
    const secret = "secret123";
    const hash = ethers.keccak256(
      ethers.solidityPacked(["uint256", "string"], [1, secret]),
    );

    await voting.connect(voter1).commitVote(1, hash);
    await voting.connect(voter1).revealVote(1, 1, secret);

    await expect(
      voting.connect(voter1).revealVote(1, 1, secret),
    ).to.be.revertedWith("Already revealed");
  });

  it("11. Should reject double commit (Negative Test)", async function () {
    await voting.createElection("Voting", 60);
    await voting.addCandidate(1, "Alice");
    const secret = "secret123";
    const hash = ethers.keccak256(
      ethers.solidityPacked(["uint256", "string"], [1, secret]),
    );

    await voting.connect(voter1).commitVote(1, hash);
    await expect(voting.connect(voter1).commitVote(1, hash)).to.be.revertedWith(
      "Already committed",
    );
  });

  it("12. Should get winner and check tie status", async function () {
    await voting.createElection("Voting", 60);
    await voting.addCandidate(1, "Alice");
    await voting.addCandidate(1, "Bob");

    const secret = "winnersecret";
    const hash = ethers.keccak256(
      ethers.solidityPacked(["uint256", "string"], [1, secret]),
    );

    await voting.connect(voter1).commitVote(1, hash);
    await voting.connect(voter1).revealVote(1, 1, secret);

    const winner = await voting.getWinner(1);
    expect(winner[0]).to.equal("Alice");
    expect(winner[1]).to.equal(1);
    expect(winner[2]).to.equal(false);
  });

  it("13. Should mark winner as tie when top votes are equal", async function () {
    await voting.createElection("Voting", 60);
    await voting.addCandidate(1, "Alice");
    await voting.addCandidate(1, "Bob");

    const aliceSecret = "alice-secret";
    const aliceHash = ethers.keccak256(
      ethers.solidityPacked(["uint256", "string"], [1, aliceSecret]),
    );
    const bobSecret = "bob-secret";
    const bobHash = ethers.keccak256(
      ethers.solidityPacked(["uint256", "string"], [2, bobSecret]),
    );

    await voting.connect(voter1).commitVote(1, aliceHash);
    await voting.connect(voter2).commitVote(1, bobHash);
    await voting.connect(voter1).revealVote(1, 1, aliceSecret);
    await voting.connect(voter2).revealVote(1, 2, bobSecret);

    const winner = await voting.getWinner(1);
    expect(winner[0]).to.equal("Alice");
    expect(winner[1]).to.equal(1);
    expect(winner[2]).to.equal(true);
  });

  it("14. Should return no votes yet when election has no revealed votes", async function () {
    await voting.createElection("Voting", 60);
    await voting.addCandidate(1, "Alice");
    await voting.addCandidate(1, "Bob");

    const winner = await voting.getWinner(1);
    expect(winner[0]).to.equal("No votes yet");
    expect(winner[1]).to.equal(0);
    expect(winner[2]).to.equal(false);
  });

  it("15. Should reject non-owner from creating election (Access Control)", async function () {
    await expect(
      voting.connect(voter1).createElection("BEM", 60),
    ).to.be.revertedWith("Not owner");
  });

  it("16. Should reject non-owner from adding candidate (Access Control)", async function () {
    await voting.createElection("Voting", 60);
    await expect(
      voting.connect(voter1).addCandidate(1, "Alice"),
    ).to.be.revertedWith("Not owner");
  });

  it("17. Should emit ElectionCreated event (Events)", async function () {
    await expect(voting.createElection("Ketua BEM", 60))
      .to.emit(voting, "ElectionCreated")
      .withArgs(1, "Ketua BEM");
  });

  it("18. Should reject vote after deadline (Time/Deadline Test)", async function () {
    await voting.createElection("Voting", 0);
    await voting.addCandidate(1, "Alice");
    const hash = ethers.keccak256(
      ethers.solidityPacked(["uint256", "string"], [1, "secret"]),
    );

    await ethers.provider.send("evm_increaseTime", [60]);
    await ethers.provider.send("evm_mine");

    await expect(voting.connect(voter1).commitVote(1, hash)).to.be.revertedWith(
      "Voting ended",
    );
  });
});
