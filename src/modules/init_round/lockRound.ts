import { web3, utils, BN } from '@project-serum/anchor'
import { getProgram } from 'config'
import { RoundModel } from '../round/round.model';

export enum Position {
    BetUp = "BetUP",
    BetDown = "BetDown"
}

export type Round = {
    id: string;
    startTimestamp: number;
    lockTimestamp: number;
    closeTimestamp: number;
    lockPrice: number;
    closePrice: number;
    totalAmountPool: number;
    betUpAmount: number;
    betDownAmount: number;
    rewardAmount: number;
}

export enum Status {
    Expired = "Expired",
    Live = "Live",
    Next = "Next"
}

export type ClientRound = {
    status: Status;
    id: string;
    lockPrice: number;
    currentPrice: number;
    totalAmountPool: number;
    betUpAmount: number;
    betDownAmount: number;
    rewardAmount: number;
}

export type BetInfo = {
    position: Position;
    amount: number;
    claimed: boolean;
}

export async function initRound(round: Round, ): Promise<Round> {
    if (!round) {
        throw Error("Round is required");
    }
    
    const {id, startTimestamp, lockTimestamp, 
        closeTimestamp,lockPrice, closePrice, 
        totalAmountPool, betUpAmount, betDownAmount, 
        rewardAmount} = round;
    
    // const program = getProgram(wallet)
    // const startTime = startDate.valueOf() / 1000
    // const endTime = endDate.valueOf() / 1000

    const roundContract = new web3.Keypair()
    let treasurer: web3.PublicKey

    const [treasurerPublicKey] = await web3.PublicKey.findProgramAddress(
      [Buffer.from('treasurer'), roundContract.publicKey.toBuffer()],
      program.programId,
    )
    treasurer = treasurerPublicKey

    let candidateTokenAccount = await utils.token.associatedAddress({
      mint: new web3.PublicKey(mintAddress),
      owner: treasurerPublicKey,
    })

    try {
      setLoading(true)
      await program.rpc.initializeCandidate(new BN(startTime), new BN(endTime), {
        accounts: {
          authority: wallet.publicKey,
          candidate: candidate.publicKey,
          treasurer,
          mint: new web3.PublicKey(mintAddress),
          candidateTokenAccount,
          tokenProgram: utils.token.TOKEN_PROGRAM_ID,
          associatedTokenProgram: utils.token.ASSOCIATED_PROGRAM_ID,
          systemProgram: web3.SystemProgram.programId,
          rent: web3.SYSVAR_RENT_PUBKEY,
        },
        signers: [candidate],
      })

      dispatch(
        setCandidate({
          address: candidate.publicKey.toBase58(),
          amount: 0,
          mint: mintAddress,
          startTime,
          endTime,
        }),
      )
      setVisible(false)
      return notification.success({ message: 'Created a candidate' })
    } catch (er: any) {
      return notification.error({ message: er.message })
    } finally {
      return setLoading(false)
    }
  }
    return round;
}

export async function onLock(wallet: any, id) {
    if(!wallet) {return}
    const program = getProgram(wallet);
    const 
}

export async function endRound() {

}