//ustawianie na tej samej pozycji diva wynik i gra
function wyrownaj_do_elementow(co, gdzie)
{
let element_pierwotny=document.getElementById(gdzie);
let element_ustawiany=document.getElementById(co);
element_ustawiany.style.top=element_pierwotny.offsetTop+'px';
}

wyrownaj_do_elementow('wynik','Gra');
window.addEventListener('resize' ,function(){wyrownaj_do_elementow('wynik','Gra')});