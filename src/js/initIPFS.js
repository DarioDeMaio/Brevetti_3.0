IPFSStarter = {
  ipfs: null,
  init: async function(){
      this.ipfs = window.ipfs || await window.IpfsCore.create();
      window.ipfs = this.ipfs;
  }
}

$(function(){
  $(window).on('load', async function(){
      await IPFSStarter.init();
      try{
        App.init();
      }catch{
        App2.init();
        App3.init();
      }
  });
});