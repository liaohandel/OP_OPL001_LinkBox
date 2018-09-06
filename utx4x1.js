console.log("[linkgateway ] start RS485 ch1  ...");

var SerialPort = require('serialport');

 /**
 * Serial Port Setup.
 */

var portName = '/dev/ttyUSB0'; //This is the standard Raspberry Pi Serial port
var readData = ''; //Array to hold the values read in from the port
var mbBuffer = '1234';

var rxcount = 0;
var rx_size =64;
var tx_size =64;
var rx_pt =0;
var tx_pt =0;
var rx_buf = new Buffer(rx_size);
var tx_buf = new Buffer(tx_size);
var qrxcmd =[];
var qtxcmd =[];

var sp = new SerialPort(portName, {
  baudRate: 9600,
  dataBits: 8,
  parity: 'none',
  stopBits: 1,
  flowControl: false
});


function rxchk(rbuf){
	console.log("check rxbuff ...x1! ",rx_pt,rx_size)
	if(rx_pt<=rx_size && rbuf.length>0){
		console.log("check rxbuff ...x2! ",rx_pt,rx_size)
		if(rx_pt>0 && rx_buf[0]==0xfa){
			rbuf.copy(rx_buf,rx_pt,0)
			rx_pt = rx_pt + rbuf.length
			console.log("check rxbuff ...x21! ",rx_pt,rx_size)
			console.log(rx_buf.toString('hex'))
		}else{			
			console.log("check rxbuff ...x22! ",rx_pt,rx_size)
			for(i=0;i<rbuf.length;i++){
				if(rbuf[i]==0xfa){
					rbuf.copy(rx_buf,0,i,rbuf.length)
					rx_pt = rx_pt + rbuf.length - i
					break;
				}
			}
		}
	}else{
		console.log("overbuff ="+data.toString('hex'));
	}
	//check rx_buff format [0xfa],[add],[pam_leng],[dat]x(pamleng)
	if(rx_buf[0]==0xfa && rx_pt >3 ){
		console.log("check rxbuff ...x3! ",rx_pt,rx_size)
		if(rx_pt > (rx_buf[2]+2)){
			console.log("check rxbuff ...x31! ",rx_pt,rx_size)
			sbuf = new Buffer(rx_buf[2]+3);
			rx_buf.copy(sbuf,0,0,rx_buf[2]+3);
			qrxcmd.push(sbuf.toString('hex'));
			rx_pt = 0
			console.log('rxcomm ='+sbuf.toString('hex'));			
			
		}		
	};	
	if(qrxcmd.length > 0){
		console.log("rx_buf leng = "+qrxcmd.length);		
		qrxcmd.forEach(function(element,index){
			console.log("qrxcmd = "+element)
		});
		//qtxcmd.push();
		//ss = qrxcmd.shift()
		//mbBuffer = "1234"
		//ttbuf = Buffer.from(ss,'hex');
		//ttbuf[0] = 0xf5
		//sp.write(ttbuf);
	}	
}

function imsendcmd(txcmd){
	
}

sp.on('data', function (data) {
    console.log(data);
    sdata = data.toString();
	rxchk(data)
    //console.log("=>"+rxcount); 
	//rxcount++;
}); 

 sp.on('close', function (err) {
console.log('port closed');
});

 sp.on('error', function (err) {
console.error("error", err);
});

 sp.on('open', function () {
console.log('port opened...');
});

sp.write(mbBuffer, function (err, bytesWritten) {
	console.log('bytes written:', bytesWritten);
});

//rs485 uart function 
exports.ch1qrxcmd = qrxcmd;
exports.ch1trxcmd = qtxcmd;

exports.ch1sp = sp


