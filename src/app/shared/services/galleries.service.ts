import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import { AuthService } from './auth.service';

import { Gallery } from '../../shared/models/gallery.model';

@Injectable()

export class GalleriesService {

  private gallery: Gallery[] = [];
  
    constructor(private http: HttpClient,
                private authService: AuthService) { }
  
    getGallery(){
      return new Observable((observer: Observer<any>)=>{
        this.http.get('http://localhost:8000/api/galleries',{
          headers: this.authService.getRequestHeaders()
        })
        .subscribe((gallery: any[])=>{
          this.gallery = gallery.map((gallery)=>{
            return new Gallery(gallery.id, gallery.name, gallery.description, gallery.images);
          });
          observer.next(this.gallery);
          return observer.complete();
        })
      })
    }

    addGallery(newGallery){
      console.log(newGallery);
      return new Observable((observer: Observer<any>)=>{
        this.http.post('http://localhost:8000/api/galleries',{
          name: newGallery.name,
          description: newGallery.description
        }).subscribe((newsGallery: any)=>{
          let galleries = new Gallery(newGallery.name, newGallery.description);
          this.gallery.push(galleries);
          observer.next(galleries);
          console.log('This works')
          return observer.complete();
        },()=>{
          alert('Error');
        });
      })
    }

    public getGalleryById(id: number){
      return new Observable((o: Observer<any>) => {
        this.http.get('http://localhost:8000/api/galleries/' + id, {
          headers: this.authService.getRequestHeaders()
        })
        .subscribe((gallery: any) => {
          let existing = this.gallery.filter(c => c.id == id);
           if (existing.length) {
                o.next(existing[0]);
             return o.complete();
        }
      });
      });
    }

    public addPicturesOnGallery(pictures){
      
      return new Observable((observer: Observer<any>)=>{
        this.http.post('http://localhost:8000/api/pictures',{
          image_url: pictures,
        }).subscribe((pictures: any)=>{
          observer.next(pictures);
          return observer.complete();
        })
  
        
      })    
    }

}
