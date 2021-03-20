export class Marcador {

    public lat: number;
    public lng: number;

    public titulo: string = 'Sense Tìtol';
    public desc: string  = 'Sense Descripció';
    public address: string  = 'Sense Adreça';


    constructor(lat: number,  lng: number ) {
        this.lat = lat;
        this.lng = lng;
        
    }

    /* constructor(titulo:string, desc:string, address:string, lat: number,  lng: number ) {
        this
        this.lat = lat;
        this.lng = lng;
        
    } */

}


// export class Marcador {

//     constructor( public lat: number, public lng: number ) { }

// }

