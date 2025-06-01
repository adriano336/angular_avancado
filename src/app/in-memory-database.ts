
import { Observable } from 'rxjs';

import { Category } from './pages/categories/shared/category.model.js';

export class InMemoryDatabase {
  createDb(reqInfo?: RequestInfo): {} | Observable<{}> | Promise<{}> {
    const categories : Array<Category> = [
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
        description:
          'Despesas com aluguel, financiamento ou manutenção da casa',
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

    return { categories };
  }
}
