import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Simbolo } from '../../interfaces/simbolo';

@Component({
  selector: 'app-symbol',
  imports: [RouterLink],
  templateUrl: './symbol.component.html',
  styleUrl: './symbol.component.scss'
})
export class SymbolComponent {
  @Input() simbolo!: Simbolo;
}
