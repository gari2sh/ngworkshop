import { Component, OnInit } from '@angular/core';
import { Ibook } from '../ibook';
import { MatSnackBar, MatDialog  } from '@angular/material';
import { DataService } from '../services/data.service';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import { BookDetailComponent } from '../book-detail/book-detail.component';



@Component({
  //selector: 'my-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {
  pageTitle: string;

  books: Array<Ibook>;
  /*books: Array<Ibook>=
  [
  {
  id: 1,
  title: "JavaScript - The Good Parts",
  author: "Douglas Crockford",
  isCheckedOut: true,
  rating: 3
  },
  {
  id: 2,
  title: "The Wind in the Willows",
  author: "Kenneth Grahame",
  isCheckedOut: false,
  rating: 4
  },
  {
  id: 3,
  title: "Pillars of the Earth",
  author: "Ken Follett",
  isCheckedOut: true,
  rating: 5
  },
  {
  id: 4,
  title: "Harry Potter and the Prisoner of Azkaban",
  author: "J. K. Rowling",
  isCheckedOut: false,
  rating: 5
  }
  ]; */
  showOperatingHours: boolean;
  openingTime:Date;
  closingTime:Date;
  searchTerm$ = new Subject<string>();
 

  constructor(private _snackBar: MatSnackBar, private _dataService: DataService,
              private _dialog: MatDialog, private _router: Router) 
    { 
    this.openingTime = new Date();
    this.openingTime.setHours(10, 0);
    this.closingTime = new Date();
    this.closingTime.setHours(15, 0);
  }

  ngOnInit() {
    //this.books = this._dataService.getBooks();
    this.getBooks();
    this._dataService.search(this.searchTerm$)
    .subscribe(books => {
    this.books = books;
    });
   
  }
  updateMessage(message: string, type: string): void {
    if (message) {
    this._snackBar.open(`${type}: ${message}`, 'DISMISS', {
    duration: 3000
    });
    }
    }

    onRatingUpdate(book: Ibook): void {
      this.updateBook(book);
      this.updateMessage(book.title, " Rating has been updated");
      }

      updateBook(book: Ibook): void {
        this._dataService.updateBook(book)
        .subscribe(
        () => {
        this._snackBar.open(`"${book.title}" has been updated!`, 'DISMISS', {
        duration: 3000
        });
        },error => this.updateMessage(<any>error, 'ERROR'));
       }
       openDialog(bookId:number): void {
        let config = {width: '650px', height: '400x', position: {top: '50px'}};
        let dialogRef = this._dialog.open(BookDetailComponent, config);
        dialogRef.componentInstance.bookId = bookId;
        dialogRef.afterClosed().subscribe(res => {
        this.getBooks();
        });
       }
       openRoute(bookId: number): void {
        this._router.navigate(['/collection', bookId]);
       }
       delete(book: Ibook) {
        this._dataService
        .deleteBook(book.id)
        .subscribe(() => {
        this.getBooks()
        this._snackBar.open(`"${book.title}" has been deleted!`,
        'DISMISS', {
        duration: 3000
        });
        }, error => this.updateMessage(<any>error, 'ERROR'));
       }
        get

    getBooks(): void {
        this._dataService.getBooks().subscribe(
        books => this.books = books,
        error => this.updateMessage(<any>error, 'ERROR'));
        }
     

}
