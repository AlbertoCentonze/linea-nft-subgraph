import { store, Bytes, BigInt, Address, log } from '@graphprotocol/graph-ts';
import { Transfer, MyNFT } from '../generated/MyNFT/MyNFT';
import { Token, TokenContract, Owner, } from '../generated/schema';

export function handleTransfer(event: Transfer): void {
  const contract = MyNFT.bind(event.address)

  const tokenId = event.transaction.hash.concatI32(event.logIndex.toI32())
  const contractId = event.address;

  let tokenContract = TokenContract.load(contractId)
  if (tokenContract == null) {
    tokenContract = new TokenContract(contractId)
    tokenContract.name = contract.name()
    tokenContract.symbol = contract.symbol()
  }

  let token = Token.load(tokenId)
  if (token == null) {
    token = new Token(tokenId)
    token.contract = contractId
    token.tokenID = event.params.tokenId
    token.owner = event.params.to
  }

  const ownerId = event.params.to
  let owner = Owner.load(ownerId)
  if (owner == null) {
    owner = new Owner(ownerId)
  }
  owner.address = event.params.to


  // token.tokenURI = contract.tokenURI(token.tokenID)

  token.save()
  tokenContract.save()
  owner.save()
}
