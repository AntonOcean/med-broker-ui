import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  searchForm;
  searchTerm = '';

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.searchForm = this.formBuilder.group({
      term: ''
    });
  }

  ngOnInit() {
  }

  onSubmit(formData) {
    if (formData.term) {
      this.searchForm.reset();
      this.router.navigate(['products/all-products'], { queryParams: {q: formData.term}});
    }
  }
}
