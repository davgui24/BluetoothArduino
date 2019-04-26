import { Component, OnInit } from "@angular/core";

import { BluetoothSerial } from "@ionic-native/bluetooth-serial/ngx";
import {
  AlertController,
  ToastController,
  LoadingController
} from "@ionic/angular";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage {
  pairedList: pairedlist;
  listToggle: boolean = false;
  pairedDeviceID: number = 0;
  dataSend: string = "";
  noPairedList: pairedlist;

  data: any;
  data2: any;

  constructor(
    private bluetoothSerial: BluetoothSerial,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    // this.leer();
    this.checkBluetoothEnabled();

    this.pendienteLeerDatos();
  }

  // ionViewDidLoad(){
  //   this.bluetoothSerial.subscribe('\n').subscribe(
  //     data=>{
  //       this.alerta('Data de inicio: '+JSON.stringify(data));
  //       this.data = data;
  //       // this.bluetoothSerial.clear();
  //   });
  // }

  checkBluetoothEnabled() {
    this.bluetoothSerial.isEnabled().then(
      success => {
        this.listPairedDevices();
        this.listNoPairedDevices();
      },
      error => {
        this.showError("Por favor, habilite Bluetooth");
      }
    );
  }
  // +++++++++++++++++++++++++++++

  listPairedDevices() {
    this.bluetoothSerial.list().then(
      success => {
        this.pairedList = success;
        this.listToggle = true;
      },
      error => {
        this.showError("Por favor, habilite Bluetooth");
        this.listToggle = false;
      }
    );
  }

  // +++++++++++++++++++++++++++++

  listNoPairedDevices() {
    // success, failure
    this.bluetoothSerial.discoverUnpaired().then(
      success => {
        this.noPairedList = success;
        this.listToggle = true;
      },
      error => {
        this.showError("Por favor, habilite Bluetooth");
        this.listToggle = false;
      }
    );
  }

  // +++++++++++++++++++++++++++++

  selectDevice(device: pairedlist) {
    let connectedDevice = this.pairedList[this.pairedDeviceID];
    if (!connectedDevice.address) {
      this.alerta("Seleccione dispositivo emparejado para conectar");
      return;
    }
    let address = connectedDevice.address;
    let name = connectedDevice.name;
    this.connect(address);
    this.alerta(JSON.stringify(device));
  }

  // +++++++++++++++++++++++++++++

  connect(address) {
    // Attempt to connect device with specified address, call app.deviceConnected if success
    this.bluetoothSerial.connect(address).subscribe(
      success => {
        this.deviceConnected();
        this.showToast("Conectado con éxito");
      },
      error => {
        this.showError("Error: Conectando al dispositivo");
      }
    );
  }

  // +++++++++++++++++++++++++++++

  deviceConnected() {
    // Subscribe to data receiving as soon as the delimiter is read
    this.bluetoothSerial.subscribe("\n").subscribe(
      success => {
        this.handleData(success);
        this.showToast("Conectado exitosamente");
      },
      error => {
        this.showError(error);
      }
    );
  }
  // +++++++++++++++++++++++++++++

  deviceDisconnected() {
    // Unsubscribe from data receiving
    this.bluetoothSerial.disconnect();
    this.showToast("Dispositivo desconectado");
  }

  // +++++++++++++++++++++++++++++

  handleData(data) {
    this.showToast(data);
  }
  // +++++++++++++++++++++++++++++

  sendData() {
    this.dataSend += "\n";
    this.showToast(this.dataSend);

    this.bluetoothSerial.write(this.dataSend).then(
      success => {
        this.showToast(success);
      },
      error => {
        this.showError(error);
      }
    );
  }
  // +++++++++++++++++++++++++++++

  async showError(error) {
    const alert = await this.alertCtrl.create({
      header: "Error",
      subHeader: error,
      buttons: ["Salir"]
    });
    await alert.present();
  }

  // +++++++++++++++++++++++++++++

  async showToast(mensaje) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

  async alerta(mensaje: string) {
    const alert = await this.alertCtrl.create({
      header: "En hora buena!!  :)",
      subHeader: mensaje,
      buttons: ["Salir"]
    });
    await alert.present();
  }

  metodo() {
    // Write a string
    this.bluetoothSerial.write("hello world").then(
      success => {
        this.showError(success);
      },
      failure => {
        this.showError(failure);
      }
    );

    // Array of int or bytes
    this.bluetoothSerial.write([186, 220, 222]).then(
      success => {
        this.showError(success);
      },
      failure => {
        this.showError(failure);
      }
    );

    // Typed Array
    var data = new Uint8Array(4);
    data[0] = 0x41;
    data[1] = 0x42;
    data[2] = 0x43;
    data[3] = 0x44;
    this.bluetoothSerial.write(data).then(
      success => {
        this.showError(data);
      },
      failure => {
        this.showError(failure);
      }
    );

    // Array Buffer
    this.bluetoothSerial.write(data.buffer).then(
      success => {
        this.showError(data.buffer);
      },
      failure => {
        this.showError(failure);
      }
    );
  }




  leer() {
    this.bluetoothSerial.read().then(data => {
      this.data = new TextDecoder('windows-1251').decode(data);
      this.alerta("Lerr: --> " + this.data);
      this.data = data;
    });

  //   this.bluetoothSerial.readUntil("\n").then(data => {
  //     // let bytes = new Uint8Array(data);
  //     // let enc = new Uint8Array(data);
  //     // this.data = String.fromCharCode.apply(null, new Uint8Array(enc));
  //     // this.alerta("Uint8Array: " + this.data);
  //     // this.data = new Uint8Array(data);
  
  //     this.alerta('LERR --> ' + this.data);
  // });
}

 

  pendienteLeerDatos() {
    this.bluetoothSerial.subscribeRawData().subscribe(data2 => {
      // let win1251decoder = new TextDecoder('windows-1251');
      // this.data2  = new Uint8Array(data2);

      // this.leer();
      
      this.data2 = new TextDecoder('x-cp1258').decode(data2);
      this.alerta('Pendiente --> ' + this.data2);

     
    
      // this.desSuscribirse();
    
    // let byte = new Uint8Array([68, 65, 86, 73, 68]);
    // this.alerta('win1251decoder --> ' + win1251decoder.decode(byte)); // david!
  });
  }


  desSuscribirse(){
    this.bluetoothSerial.clear().then(success => {
      this.showToast('Bien --> ' + success);
    })
    .catch(err => this.showToast('Mal --> ' + err))
  }

}



interface pairedlist {
  class: number;
  id: string;
  address: string;
  name: string;
}
