const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors'); // cors modülü ekleniyor
const server = http.createServer(app);
const { Server } = require("socket.io");
const { SaveMessage } = require('./conttroller/SaveMessage');
const { validateApiKeyMiddle } = require('./conttroller/apikey');
const io = new Server(server,{
    maxHttpBufferSize: 30e6
});

app.use(cors());
//
app.get('/deneme', (req, res) => {
	//   res.sendFile(__dirname + '/index.html');
	res.send("abc")
});
const mudurlukler = [
	{
		"No": "1",
		"Birim Adı": "ÖZEL KALEM MÜDÜRLÜĞÜ",
		"users":[]
	},
	{
		"No": "2",
		"Birim Adı": "İNSAN KAYNAKLARI VE EĞİTİM MÜDÜRLÜĞÜ",
		"users":[]
		
	},
	{
		"No": "3",
		"Birim Adı": "BİLGİ İŞLEM MÜDÜRLÜĞÜ",
		"users":[]
	},
	{
		"No": "5",
		"Birim Adı": "YAZI İŞLERİ MÜDÜRLÜĞÜ",
		"users":[]
	},
	{
		"No": "6",
		"Birim Adı": "TEFTİŞ KURULU MÜDÜRLÜĞÜ",
		"users":[]
	},
	{
		"No": "8",
		"Birim Adı": "HUKUK İŞLERİ MÜDÜRLÜĞÜ",
		"users":[]
	},
	{
		"No": "9",
		"Birim Adı": "BASIN VE HALKLA İLİŞKİLER MÜDÜRLÜĞÜ",
		"users":[]
	},
	{
		"No": "12",
		"Birim Adı": "FEN İŞLERİ MÜDÜRLÜĞÜ",
		"users":[]
	},
	{
		"No": "17",
		"Birim Adı": "İMAR VE ŞEHİRCİLİK MÜDÜRLÜĞÜ",
		"users":[]
	},
	{
		"No": "20",
		"Birim Adı": "İTFAİYE MÜDÜRLÜĞÜ",
		"users":[]
	},
	{
		"No": "21",
		"Birim Adı": "KÜLTÜR VE SOSYAL İŞLERİ MÜDÜRLÜĞÜ",
		"users":[]
	},
	{
		"No": "22",
		"Birim Adı": "MEZARLIKLAR MÜDÜRLÜĞÜ",
		"users":[]
	},
	{
		"No": "23",
		"Birim Adı": "PARK VE BAHÇELER MÜDÜRLÜĞÜ",
		"users":[]
	},
	{
		"No": "26",
		"Birim Adı": "TEMİZLİK İŞLERİ MÜDÜRLÜĞÜ",
		"users":[]
	},
	{
		"No": "28",
		"Birim Adı": "VETERİNER İŞLERİ MÜDÜRLÜĞÜ",
		"users":[]
	},
	{
		"No": "29",
		"Birim Adı": "ZABITA MÜDÜRLÜĞÜ",
		"users":[]
	},
	{
		"No": "35",
		"Birim Adı": "DESTEK HİZMETLERİ MÜDÜRLÜĞÜ",
		"users":[]
	},
	{
		"No": "40",
		"Birim Adı": "ULAŞIM HİZMETLERİ MÜDÜRLÜĞÜ",
		"users":[]
	},
	{
		"No": "41",
		"Birim Adı": "YAPI KONTROL MÜDÜRLÜĞÜ",
		"users":[]
	},
	{
		"No": "43",
		"Birim Adı": "İKLİM DEĞİŞİKLİĞİ VE SIFIR ATIK MÜD.",
		"users":[]
	},
	{
		"No": "45",
		"Birim Adı": "ETÜD PROJE MÜDÜRLÜĞÜ",
		"users":[]
	},
	{
		"No": "46",
		"Birim Adı": "SU VE KANALİZASYON MÜDÜRLÜĞÜ",
		"users":[]
	},
	{
		"No": "48",
		"Birim Adı": "MALİ HİZMETLER MÜDÜRLÜĞÜ",
		"users":[]
	},
	{
		"No": "50",
		"Birim Adı": "MUHTARLIK İŞLERİ MÜDÜRLÜĞÜ",
		"users":[]
	}
];


// Odaları oluşturma
const rooms = {};
mudurlukler.forEach(mudurluk => {
	rooms[mudurluk.No] = { name: mudurluk["Birim Adı"], users: {} };
});

io.on('connection', (socket) => {
	console.log('Yeni bir kullanıcı bağlandı');
	console.log('Gelen API Anahtarı:', socket.handshake.auth.apiKey);
	const result=validateApiKeyMiddle(socket.handshake.auth.apiKey);
	if(!result){
		console.log('Hatalı API Anahtarı veya eksik bilgi');
		socket.disconnect(); // Bağlantıyı reddetmek veya kesmek için
		return;
	
	}

	// Kullanıcıyı bir odaya katılma işlemi
	socket.on('joinRoom', (user) => {
		console.log("gelen user",user);
		// roomId'i kullanarak ilgili odanın index'ini bulma
        const roomIndex = mudurlukler.findIndex(room => room['No'] === user.mudurlukno);
		// Kullanıcıyı odaya ekle
		mudurlukler[roomIndex].users.push(user);
		console.log(`${user.ad} odaya eklendi: ${mudurlukler[roomIndex]['Birim Adı']}`);		// Socket.IO odasına katılma işlemi
		socket.join(user.mudurlukno);
	});
	socket.on('sendMessage',(message)=>{
		console.log("mesaj geldi",message)
		io.to(message.room_id).emit('groupMessage', message); // Belirli odaya mesaj gönder
		// socket.broadcast.to(message.room_id).emit('groupMessage', message); // Belirli odaya mesaj gönder
		// DB KAYIT
		SaveMessage(message)	
	})

	socket.on('disconnect', () => {
		console.log('Bir kullanıcı ayrıldı');
	});
});
server.listen(1923, () => {
	console.log('listening on *:1923');
});

