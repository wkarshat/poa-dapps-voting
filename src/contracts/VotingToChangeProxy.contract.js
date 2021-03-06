import Web3 from 'web3';
import networkAddresses from './addresses';
import helpers from "./helpers";

export default class VotingToChangeProxy {
  async init({web3, netId}) {
    const {VOTING_TO_CHANGE_PROXY_ADDRESS} = networkAddresses(netId);
    console.log('VotingToChangeProxy address', VOTING_TO_CHANGE_PROXY_ADDRESS)
    let web3_10 = new Web3(web3.currentProvider);

    const branch = helpers.getBranch(netId);

    let votingToChangeProxyABI = await helpers.getABI(branch, 'VotingToChangeProxyAddress')

    this.votingToChangeProxyInstance = new web3_10.eth.Contract(votingToChangeProxyABI, VOTING_TO_CHANGE_PROXY_ADDRESS);
  }

  //setters
  createBallotToChangeProxyAddress({startTime, endTime, proposedValue, contractType, sender, memo}) {
    return this.votingToChangeProxyInstance.methods.createBallotToChangeProxyAddress(startTime, endTime, proposedValue, contractType, memo).send({from: sender})
  }

  vote(_id, choice, sender) {
    return this.votingToChangeProxyInstance.methods.vote(_id, choice).send({from: sender})
  }

  finalize(_id, sender) {
    return this.votingToChangeProxyInstance.methods.finalize(_id).send({from: sender})
  }

  //getters
  getStartTime(_id) {
    return this.votingToChangeProxyInstance.methods.getStartTime(_id).call();
  }

  getEndTime(_id) {
    return this.votingToChangeProxyInstance.methods.getEndTime(_id).call();
  }

  votingState(_id) {
    return this.votingToChangeProxyInstance.methods.votingState(_id).call();
  }

  getTotalVoters(_id) {
    return this.votingToChangeProxyInstance.methods.getTotalVoters(_id).call();
  }

  getProgress(_id) {
    return this.votingToChangeProxyInstance.methods.getProgress(_id).call();
  }

  getIsFinalized(_id) {
    return this.votingToChangeProxyInstance.methods.getIsFinalized(_id).call();
  }

  isValidVote(_id, votingKey) {
    return this.votingToChangeProxyInstance.methods.isValidVote(_id, votingKey).call();
  }

  isActive(_id) {
    return this.votingToChangeProxyInstance.methods.isActive(_id).call();
  }

  getProposedValue(_id) {
    return this.votingToChangeProxyInstance.methods.getProposedValue(_id).call();
  }

  getContractType(_id) {
    return this.votingToChangeProxyInstance.methods.getContractType(_id).call();
  }

  getMemo(_id) {
    return this.votingToChangeProxyInstance.methods.getMemo(_id).call();
  }

  getMiningByVotingKey(_votingKey) {
    return this.votingToChangeProxyInstance.methods.getMiningByVotingKey(_votingKey).call();
  }

  async getValidatorActiveBallots(_votingKey) {
    let miningKey;
    try {
      miningKey = await this.getMiningByVotingKey(_votingKey);
    }
    catch(e) {
      miningKey = "0x0000000000000000000000000000000000000000";
    }
    return await this.votingToChangeProxyInstance.methods.validatorActiveBallots(miningKey).call();
  }

  async getBallotLimit(_votingKey) {
    const currentLimit = await this.votingToChangeProxyInstance.methods.getBallotLimitPerValidator().call();
    return currentLimit - await this.getValidatorActiveBallots(_votingKey);
  }
}