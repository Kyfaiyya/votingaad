const hre = require("hardhat");

async function main() {
  const CONTRACT_ADDRESS = "PASTE_DEPLOYED_ADDRESS_HERE";

  const voting = await hre.ethers.getContractAt(
    "SimpleVoting",
    CONTRACT_ADDRESS
  );

  console.log("\n=== CREATE ELECTION ===");
  await voting.createElection("Ketua BEM ITS", 60);
  console.log("Election created");

  console.log("\n=== ADD CANDIDATES ===");
  await voting.addCandidate(1, "Alice");
  await voting.addCandidate(1, "Bob");
  console.log("Candidates added");

  const [owner, voter1, voter2] = await hre.ethers.getSigners();

  console.log("\n=== COMMIT VOTES ===");
  const secret1 = "secret123";
  const hash1 = hre.ethers.keccak256(
    hre.ethers.solidityPacked(["uint256", "string"], [1, secret1])
  );
  await voting.connect(voter1).commitVote(1, hash1);
  console.log("Voter1 committed");

  const secret2 = "bobsecret";
  const hash2 = hre.ethers.keccak256(
    hre.ethers.solidityPacked(["uint256", "string"], [2, secret2])
  );
  await voting.connect(voter2).commitVote(1, hash2);
  console.log("Voter2 committed");

  console.log("\n=== REVEAL VOTES ===");
  await voting.connect(voter1).revealVote(1, 1, secret1);
  console.log("Voter1 revealed");

  await voting.connect(voter2).revealVote(1, 2, secret2);
  console.log("Voter2 revealed");

  console.log("\n=== LIVE RESULT ===");
  const election = await voting.getElection(1);
  const candidateCount = Number(election[3]);

  for (let i = 1; i <= candidateCount; i++) {
    const candidate = await voting.getCandidate(1, i);
    console.log(`Candidate ${candidate[0]}`);
    console.log(`Name: ${candidate[1]}`);
    console.log(`Votes: ${candidate[2]}`);
    console.log("----------------");
  }

  console.log("\n=== WINNER ===");
  const winner = await voting.getWinner(1);
  console.log(`Winner: ${winner[0]}`);
  console.log(`Total Votes: ${winner[1]}`);
  console.log(`Is Tie: ${winner[2]}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
