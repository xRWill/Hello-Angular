import { MenuItem } from './core/models/MenuItem';

/**
 * Here you can add manu items to display on right-sidebar/top-navbar components.
 */

export const MENU: MenuItem[] = [
  { label: 'Header', icon: '', url: '', visivility: 'private', isHeader: true, childs: [] },
  { label: 'Home', icon: 'fa fa-home', url: '/front/landing', visivility: 'private', isHeader: false, childs: [] },
  { label: 'Landing', icon: 'fa fa-home', url: '/front/landing', visivility: 'public', isHeader: false, childs: [] },
];