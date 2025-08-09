//Pawel Drwiega
class Plansza{
	constructor(name)
	{
		this.dostep=document.getElementById(name);
		this.rysuj=this.dostep.getContext('2d');
	}
	
	czysc()
	{
		this.rysuj.beginPath();
		this.rysuj.clearRect(0,0 , this.dostep.width, this.dostep.height);
		this.rysuj.closePath();
	}
};

class Gracz extends Plansza
{
	constructor(name, x, szer,wys)
	{
		
		super(name);
		this.szerokosc=szer;
		this.wysokosc=wys;
		this.x=this.dostep.width/2;
		this.y=this.dostep.height-this.wysokosc-2;
		this.etap_skoku=0;
	}
	
	narysuj()
	{
		this.rysuj.beginPath();
		this.rysuj.fillStyle="red";
		this.rysuj.fillRect(this.x, this.y, this.szerokosc, this.wysokosc);
		this.rysuj.closePath();
	}
	
	lewo()
	{
		this.x=this.x-5;
	}
	
	prawo()
	{
		this.x=this.x+5;
	}

	gora()
	{
		this.y=this.y-2;
	}
	
	dol()
	{
		this.y=this.y+2;
	}
	
	zainicjuj_skok()
	{
		ja.etap_skoku=1;
	}
	
};

class Platforma extends Plansza
{
		constructor(name)
		{
			super(name);
			this.wysokosc=4;
			this.x=Math.random()*(2/3)*this.dostep.width;
			this.szerokosc=Math.random()*(this.dostep.width-this.x)+1;
			this.nagroda=new Nagroda(name,this.x,this.szerokosc);
		}
		
		ustaw_poziom(level, gracz)
		{
			this.y=this.dostep.height-level*(gracz.wysokosc+this.wysokosc+4);
			this.nagroda.ustaw_y(this.y);
		}
		
		narysuj()
		{
			this.rysuj.beginPath();
			this.rysuj.fillStyle="green";
			this.rysuj.fillRect(this.x, this.y, this.szerokosc, this.wysokosc);
			this.rysuj.closePath();
		}
			
};

class Nagroda extends Plansza
{
	constructor(name, w_x ,szerokosc)
	{
			super(name);
			this.poczotek=w_x;
			//this.y=w_y-2;
			this.koniec=w_x+szerokosc;
			this.x=Math.random()*(this.koniec-this.poczotek)+this.poczotek;
			this.czy_aktywny=false;	
	}	
	ustaw_y(w_y)
	{
		this.y=w_y-2;
	}
	narysuj()
	{
		if(this.czy_aktywny===true)
		{	
			this.rysuj.beginPath();
			this.rysuj.fillStyle="blue";
			this.rysuj.arc(this.x, this.y-2, 2, 0 ,2*Math.PI);
			this.rysuj.stroke();
			this.rysuj.fill();
			this.rysuj.closePath();
			if(this.zywotnosc<=0)
			{
				this.czy_aktywny=false;
			}
			else
			{
				this.zywotnosc=this.zywotnosc-1;
			}			
		}
	}
	
	aktywuj()
	{
			this.czy_aktywny=true;
			this.zywotnosc=200+Math.floor(Math.random()*200);
	}
};

//poczotek derektywy
let ja=new Gracz('Gra', 10,10, 10);
let ile_platform=5;
let pozycja_nagrody;
let punkty=0;
let podloze = new Array(ile_platform);
//zmiene mowy
window.SpeechRecognition=window.webkitSpeechRecognition || window.SpeechRecognition;
const mowa=new SpeechRecognition();
mowa.lang='pl-PL';
mowa.interimResults=true;
let poczotek_komend=0; 
 
for(let i=0; i<5; i++)
{
	podloze[i]=new Platforma('Gra');
}	

function skok()
{
	if(!(ja.etap_skoku==0))
	{
		ja.gora();
		switch (ja.etap_skoku)
		{

			case 1: ja.etap_skoku++; break;
			case 2: ja.etap_skoku++; break;
			case 3: ja.etap_skoku++; break;
			case 4: ja.etap_skoku++; break;
			case 5: ja.etap_skoku++; break;
			case 6: ja.etap_skoku++; break;
			case 7: ja.etap_skoku=0; break;
		}
	}
}

function spadanie()
{
	if(ja.etap_skoku===0)
	{
		if(ja.y+ja.wysokosc<ja.dostep.height-2)
		{
			for(let i=0; i<ile_platform; i++)
			{
				if(podloze[i].x+podloze[i].szerokosc>(ja.x+ja.szerokosc/2) && (ja.x+ja.szerokosc/2)>podloze[i].x)
				{
					if(podloze[i].y+podloze[i].wysokosc>=(ja.y) && (ja.y+ja.wysokosc)>=podloze[i].y)
					{
						ja.y=podloze[i].y-ja.wysokosc;
						return;
					}	
				}
			}				
			ja.dol();
		}
	}		
}


function animacja()
{	
	ja.czysc();
	ja.narysuj();
	for(let i=1; i<6; i++)
	{	
	podloze[i-1].ustaw_poziom(i, ja);
	podloze[i-1].narysuj();
	}
	skok();
	spadanie();
	podloze[pozycja_nagrody].nagroda.narysuj();
	if(podloze[pozycja_nagrody].nagroda.czy_aktywny===true)
	{
		if(czy_zdobyto_monete(ja.x, ja.y, ja.szerokosc, podloze[pozycja_nagrody].nagroda.x, podloze[pozycja_nagrody].nagroda.y)===true)
		{
			pozycja_nagrody=losuj_platforme();
		}
	}
}

function sterowanie(napis)
{
	console.log(napis.length);
	let i;
	let komenda="";
	for ( i=poczotek_komend; i<napis.length; i++)
	{
	
		if(napis[i]==" " || napis[i]=="." || napis[i]==",")
		{
			break;
		}
		else
		{
			komenda=komenda+napis[i];
		}
	}	
	while(napis[i]!=" " && i<napis.length)
	{
		i++;
	}	
	i++;
	poczotek_komend=i;
	komenda=komenda.toUpperCase();
	if(komenda==="GÓRA") ja.zainicjuj_skok();
	if(komenda==="LEWO") ja.lewo();
	if(komenda==="PRAWO") ja.prawo();
	return komenda;
}
 
function obsluga_mowy(zdarzenie){	
	let tab=Array.from(zdarzenie.results).map(result=>result[0]);
	sterowanie(tab[0].transcript);
	console.log(tab[0].transcript);
}

function zeruj_mowe()
{
	poczotek_komend=0;
	mowa.start();
}

function losuj_platforme()
{
	let pom=Math.floor(Math.random()*ile_platform);
	podloze[pom].nagroda.aktywuj();
	podloze[pom].nagroda.narysuj();
	return pom;
};

function pisz_wynik(gdzie)
{
	let wynik='<h4>Zdobyte punkty</h4>'
	wynik=wynik+punkty;
	document.getElementById(gdzie).innerHTML=wynik;
}
 
function czy_zdobyto_monete( g_x, g_y, g_sz, m_x, m_y) 
{
	if(g_x<m_x  && m_x<(g_x+g_sz) && g_y<m_y && m_y<(g_y+g_sz))
	{
		punkty++;
		pisz_wynik('wynik');
		return true;
	}	
	return false;
}

pozycja_nagrody=losuj_platforme();
setInterval(animacja, 100);
pisz_wynik('wynik');
mowa.addEventListener('result', obsluga_mowy);
mowa.addEventListener('end' , zeruj_mowe);
mowa.start();
