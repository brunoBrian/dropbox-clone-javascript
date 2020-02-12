class DropBoxController {
  constructor() {
    this.btnSendFileEl = document.querySelector("#btn-send-file");
    this.inputFilesEl = document.querySelector("#files");
    this.snackModalEl = document.querySelector("#react-snackbar-root");
    this.progressBarEl = this.snackModalEl.querySelector(".mc-progress-bar-fg");
    this.nameFileEl = this.snackModalEl.querySelector(".filename");
    this.timeLeft = this.snackModalEl.querySelector(".timeleft");

    this.initEvents(); 
  }

  initEvents() {
    this.btnSendFileEl.addEventListener('click', event => {
      this.inputFilesEl.click();
    });

    this.inputFilesEl.addEventListener('change', event => {
      this.uploadTasks(event.target.files);
      this.modalShow();
      this.inputFilesEl.value = '';
    });
  }

  modalShow(show=true) {
    this.snackModalEl.style.display = show ? 'block' : 'none';
  }

  uploadTasks(files) {
    let promisses = [];

    [...files].forEach(file => {
      promisses.push(new Promise((resolve, reject) => {
        let ajax = new XMLHttpRequest();

        ajax.open('POST', '/upload');

        ajax.onload = event => {
          this.modalShow(false);

          try {
            resolve(JSON.parse(ajax.responseText));
          } catch(e) {
            reject(e);
          }
        };

        ajax.onerror = event => {
          this.modalShow(false);

          reject(event);
        };

        ajax.upload.onprogress = event => {

          this.uploadProgress(event, file);

          // console.log(event)
        }

        let formData = new FormData();
        formData.append('input-file', file);

        this.startUploadTime = Date.now();

        ajax.send(formData);
      }))
    });

    return Promise.all(promisses);
  }

  uploadProgress(event, upload) {
    let { loaded, total } = event;

    let timeSpend = Date.now() - this.startUploadTime;
    let porcent = parseInt((loaded / total) * 100);
    let timeLeft = (100 - porcent) * timeSpend / porcent;

    this.progressBarEl.style.width = `${porcent}%`;
    this.timeLeft.innerHTML = this.formatTimeToHuman(timeLeft);
  }

  formatTimeToHuman(duration) {
    let seconds = parseInt((duration / 1000) % 60);
    let minutes = parseInt((duration / (1000 * 60)) % 60);
    let hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    if(hours > 0){
      return `${hours} horas, ${minutes} minutos e ${seconds} segundos`;
    }

    if(minutes > 0){
      return `${minutes} minutos e ${seconds} segundos`;
    }

    if(seconds > 0){
      return `${seconds} segundos`;
    }

    return 0;
  }

}