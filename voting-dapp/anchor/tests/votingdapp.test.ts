import { BankrunProvider, startAnchor } from "anchor-bankrun";
import { Keypair, PublicKey } from "@solana/web3.js";
import { AnchorError, BN, Program } from "@coral-xyz/anchor";
import { Votingdapp } from "../target/types/votingdapp";
import { publicKey } from "@coral-xyz/anchor/dist/cjs/utils";
  
const IDL = require("../target/idl/votingdapp.json");
const votingAdress = new PublicKey("JAVuBXeBZqXNtS73azhBDAoYaaAFfo4gWXoZe2e7Jf8H");

describe("votingdapp", () => {

  it("Initializes the program", async () => {
    const context = await startAnchor("",[{
      name: "votingdapp",
      programId: votingAdress,
    }],[]);

    const provider = new BankrunProvider(context);
    const votingProgram  = new Program<Votingdapp>(IDL, provider);
    await votingProgram.methods.initialize(
      new BN(1),
      "What is your favorite color?", 
      new BN(0),
      new BN(1850775545),
    ).rpc();

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new BN(1).toArrayLike(Buffer, "le", 8)],
      votingAdress
    );

    const poll  = await votingProgram.account.poll.fetch(pollAddress);

    console.log(poll);

    expect(poll.pollId.toNumber()).toBe(1);
    expect(poll.description).toEqual("What is your favorite color?");
    expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());
  });
});