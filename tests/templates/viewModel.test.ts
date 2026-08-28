import { buildPortfolioViewModel } from '../../src/templates/viewModel';
import { PortfolioSessionSchema } from '../../src/domain/portfolio/schema';

describe('ViewModel', () => {
  it('should filter only selected projects and skills', () => {
    const session = PortfolioSessionSchema.parse({
      projects: [
        { id: '1', title: 'P1', selected: true, source: { type: 'manual' } },
        { id: '2', title: 'P2', selected: false, source: { type: 'manual' } }
      ],
      skills: [
        { id: '1', name: 'S1', selected: true },
        { id: '2', name: 'S2', selected: false }
      ]
    });

    const viewModel = buildPortfolioViewModel(session);
    
    expect(viewModel.projects).toHaveLength(1);
    expect(viewModel.projects[0].id).toBe('1');
    
    expect(viewModel.skills).toHaveLength(1);
    expect(viewModel.skills[0].id).toBe('1');
  });

  it('should respect section orders', () => {
    const session = PortfolioSessionSchema.parse({
      portfolio: {
        sections: [
          { id: 'skills', visible: true, order: 1 },
          { id: 'hero', visible: true, order: 0 }
        ]
      }
    });

    const viewModel = buildPortfolioViewModel(session);
    
    expect(viewModel.sections[0].id).toBe('hero');
    expect(viewModel.sections[1].id).toBe('skills');
  });
});
