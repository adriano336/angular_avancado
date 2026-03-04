import { HttpInterceptorFn } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { Category } from '../pages/categories/shared/category.model.js';
import { Entry } from '../pages/entries/shared/entry.model.js';

export const mockInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
): Observable<HttpEvent<any>> => {
  ///Categories
  const { url, method, body } = req;
  let mockCategories: Category[] = [
    {
      id: 1,
      name: 'Lazer',
      description: 'Atividades de entretenimento e diversão',
    },
    {
      id: 2,
      name: 'Alimentação',
      description: 'Despesas com comida e bebida',
    },
    {
      id: 3,
      name: 'Transporte',
      description: 'Gastos com locomoção, combustível, passagens, etc.',
    },
    {
      id: 4,
      name: 'Educação',
      description: 'Investimentos em cursos, livros e mensalidades',
    },
    {
      id: 5,
      name: 'Moradia',
      description: 'Despesas com aluguel, financiamento ou manutenção da casa',
    },
    {
      id: 6,
      name: 'Saúde',
      description: 'Gastos com medicamentos, consultas, exames, etc.',
    },
    {
      id: 7,
      name: 'Vestuário',
      description: 'Compras de roupas, calçados e acessórios',
    },
    {
      id: 8,
      name: 'Tecnologia',
      description: 'Aparelhos eletrônicos, serviços digitais, etc.',
    },
    {
      id: 9,
      name: 'Impostos',
      description: 'Pagamentos de tributos, taxas e contribuições',
    },
    {
      id: 10,
      name: 'Investimentos',
      description: 'Aportes em ações, fundos, poupança e similares',
    },
  ];

  if (req.url.endsWith('api/categories') && req.method === 'GET') {
    const categories: Array<Category> = mockCategories;
    return of(new HttpResponse({ status: 200, body: categories }));
  }

  // POST
  if (url.endsWith('api/categories') && method === 'POST') {
    const newCategory = { ...body, id: Date.now() };
    mockCategories.push(newCategory);
    return of(new HttpResponse({ status: 201, body: newCategory }));
  }

  // PUT
  if (url.match(/api\/categories\/\d+$/) && method === 'PUT') {
    const id = parseInt(url.split('/').pop()!, 10);
    const index = mockCategories.findIndex((cat) => cat.id === id);
    if (index > -1) {
      mockCategories[index] = { ...mockCategories[index], ...body };
      return of(new HttpResponse({ status: 200, body: mockCategories[index] }));
    } else {
      return of(new HttpResponse({ status: 404 }));
    }
  }

  // DELETE
  if (url.match(/api\/categories\/\d+$/) && method === 'DELETE') {
    const id = parseInt(url.split('/').pop()!, 10);
    mockCategories = mockCategories.filter((cat) => cat.id !== id);
    return of(new HttpResponse({ status: 204 }));
  }

  //GET_ID
  if (url.match(/api\/categories\/\d+$/) && req.method === 'GET') {
    const id = parseInt(url.split('/').pop()!, 10);
    const category: Category =
      mockCategories.find((m) => m.id == id) ?? new Category();
    return of(new HttpResponse({ status: 200, body: category }));
  }

  ///Entries
  const mockEntries: Entry[] = [
    new Entry(
      1,
      'Cinema',
      'Filme no cinema',
      'expense',
      '50.00',
      '2025-06-01',
      true,
      1,
      mockCategories[0],
    ),
    new Entry(
      2,
      'Mercado',
      'Compras do mês',
      'expense',
      '350.00',
      '2025-06-02',
      true,
      2,
      mockCategories[1],
    ),
    new Entry(
      3,
      'Ônibus',
      'Passagem de ônibus',
      'expense',
      '4.50',
      '2025-06-03',
      false,
      3,
      mockCategories[2],
    ),
    new Entry(
      4,
      'Curso online',
      'Curso de Angular',
      'expense',
      '120.00',
      '2025-06-04',
      true,
      4,
      mockCategories[3],
    ),
    new Entry(
      5,
      'Salário',
      'Recebimento mensal',
      'revenue',
      '4000.00',
      '2025-06-05',
      true,
      5,
      mockCategories[4],
    ),
  ];

  if (req.url.endsWith('api/entries') && req.method === 'GET') {
    const entries: Array<Entry> = mockEntries;
    return of(new HttpResponse({ status: 200, body: entries }));
  }
    //GET_ID
  if (url.match(/api\/entries\/\d+$/) && req.method === 'GET') {
    const id = parseInt(url.split('/').pop()!, 10);
    const entry: Entry =
      mockEntries.find((m) => m.id == id) ?? new Entry();
    return of(new HttpResponse({ status: 200, body: entry }));
  }

  return next(req); // continua se não for mockado
};
