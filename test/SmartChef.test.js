const { expectRevert, time } = require('@openzeppelin/test-helpers');
const { assert } = require('chai');
const JSBI           = require('jsbi')
const hskdToken = artifacts.require('hskdToken');
const SmartChef = artifacts.require('SmartChef');
const MockBEP20 = artifacts.require('libs/MockBEP20');
const perBlock = '100';
contract('MasterChef', ([alice, bob, carol, dev, refFeeAddr, minter]) => {
    beforeEach(async () => {
        this.hskd  = await hskdToken.new({ from: minter });
        this.rewardToken = await MockBEP20.new('Reward Token', 'RW1', '1000000', { from: minter });
        this.chef = await SmartChef.new(this.hskd.address, this.rewardToken.address, perBlock, '200', '1000', '43000', refFeeAddr, { from: minter });
        
        await this.hskd.mint(alice, '1000', { from: minter });
        await this.hskd.mint(bob, '1000', { from: minter });
        await this.rewardToken.transfer(this.chef.address, '1000', { from: minter });
        console.log('balance chef for reward token: ', (await this.rewardToken.balanceOf(this.chef.address)).toString());
    });
    it('real case', async () => {

        

        await this.hskd.approve(this.chef.address, '1000', { from: alice });
        await this.hskd.approve(this.chef.address, '1000', { from: bob });
        await this.chef.deposit('1', { from: alice });
        await this.chef.deposit('1', { from: bob });

        let alisehskdBalance = await this.hskd.balanceOf(alice);
        console.log('alise hskd balance: ', alisehskdBalance.toString());
        console.log('balance hskd for chef: ', (await this.hskd.balanceOf(this.chef.address)).toString());
        let bobhskdBalance = await this.hskd.balanceOf(bob);
        console.log('bob hskd balance: ', bobhskdBalance.toString());
        console.log('balance hskd for chef: ', (await this.hskd.balanceOf(this.chef.address)).toString());

        await time.advanceBlockTo('201');
       
        await this.chef.withdraw('1', { from: alice });
        await this.chef.withdraw('1', { from: bob });
        await this.chef.withdrawRefFee({ from: minter });
        console.log('-----');
        alisehskdBalance = await this.hskd.balanceOf(alice);
        bobhskdBalance = await this.hskd.balanceOf(bob);
        console.log('alise hskd balance: ', alisehskdBalance.toString());
        console.log('balance hskd for chef: ', (await this.hskd.balanceOf(this.chef.address)).toString());
        console.log('balance reward token for alice: ', (await this.rewardToken.balanceOf(alice)).toString());
        console.log('bob hskd balance: ', bobhskdBalance.toString());
        console.log('balance hskd for chef: ', (await this.hskd.balanceOf(this.chef.address)).toString());
        console.log('balance reward token for bob: ', (await this.rewardToken.balanceOf(bob)).toString());
        console.log('balance reward token for ref fee: ', (await this.rewardToken.balanceOf(refFeeAddr)).toString());

    })

});
