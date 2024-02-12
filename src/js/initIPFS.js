IPFSStarter = {
  ipfs: null,
  init: async function(){
      this.ipfs = window.ipfs || await window.Ipfs.create();
      window.ipfs = this.ipfs;
  }
}

$(function(){
  $(window).on('load', async function(){
      await IPFSStarter.init();
      App.init();
  });
});