import { Component, OnInit } from '@angular/core';

export class MenuItem {
  label: string;
  url: string;
  icon: string;
  childs: MenuItem[];
  isHeader: boolean;
}

@Component({
  selector: '[app-admin-lte-main-sidebar]',
  templateUrl: './admin-lte-main-sidebar.component.html',
  styleUrls: ['./admin-lte-main-sidebar.component.css']
})
export class AdminLteMainSidebarComponent implements OnInit {

  public menuItems: MenuItem[] = [
    { label: 'Header', icon:'', url: '', isHeader: true, childs: [] },
    { label: 'menu 1', icon:'fa fa-link', url: '/foo/foo', isHeader: false, childs: [] },
    { label: 'menu 2', icon:'fa fa-link', url: '/foo/foo', isHeader: false, childs: [] },
    { label: 'tree 1', icon:'fa fa-link', url: '/foo/foo', isHeader: false, childs: [
      { label: 'sub-menu 1', icon:'fa fa-link', url: '/foo/foo', isHeader: false, childs: [] },
      { label: 'sub-menu 2', icon:'fa fa-link', url: '/foo/foo', isHeader: false, childs: [] },
      { label: 'sub-menu 3', icon:'fa fa-link', url: '/foo/foo', isHeader: false, childs: [] },
    ] },
    { label: 'tree 2', icon:'fa fa-home', url: '/foo/foo', isHeader: false, childs: [
      { label: 'sub-menu 1', icon:'fa fa-link', url: '/foo/foo', isHeader: false, childs: [] },
      { label: 'sub-menu 2', icon:'fa fa-link', url: '/foo/foo', isHeader: false, childs: [] },
      { label: 'sub-menu 3', icon:'fa fa-link', url: '/foo/foo', isHeader: false, childs: [] },
    ] }
  ];

  public selectedItemIndex: number = 0;

  constructor() { }

  ngOnInit() { }

  public selectedMenuItem(itemIndex: number){
    this.selectedItemIndex = itemIndex;
  }

}
