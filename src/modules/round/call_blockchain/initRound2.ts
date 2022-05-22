import { Fragment, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useConnectedWallet } from '@gokiprotocol/walletkit'
import moment from 'moment'
import { web3, utils, BN } from '@project-serum/anchor'

import { Button, Col, DatePicker, Modal, Row, Space, Typography, Input, notification } from 'antd'
import { UserAddOutlined } from '@ant-design/icons'

import { setCandidate } from 'store/candidates.reducer'
import { getProgram } from '../config'

const CreateCandidate = () => {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState<moment.Moment>()
  const [endDate, setEndDate] = useState<moment.Moment>()
  const [mintAddress, setMintAddress] = useState('')
  const dispatch = useDispatch()
  const wallet = useConnectedWallet()

  const onCreateCandidate = async () => {
    if (!wallet || !startDate || !endDate) return
    const program = getProgram(wallet)
    const startTime = startDate.valueOf() / 1000
    const endTime = endDate.valueOf() / 1000

    const candidate = new web3.Keypair()
    let treasurer: web3.PublicKey

    const [treasurerPublicKey] = await web3.PublicKey.findProgramAddress(
      [Buffer.from('treasurer'), candidate.publicKey.toBuffer()],
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
}

export default CreateCandidate
