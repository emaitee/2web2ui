import { mapStateToProps } from '../bounceReport';
import * as bounceHelpers from 'src/helpers/bounce';

jest.mock('src/helpers/bounce');

describe('Selector: Bounce Report', () => {

  let testState;
  let bandTypes;
  let reshapedCategories;
  let formattedAggregates;

  beforeEach(() => {
    testState = {
      reportOptions: {},
      bounceReport: {
        aggregates: {
          count_targeted: 100,
          count_bounce: 4,
          count_inband_bounce: 2,
          count_outofband_bounce: 1
        },
        aggregatesLoading: false,
        categoriesLoading: false,
        reasonsLoading: false,
        reasons: [],
        classifications: ['class1']
      }
    };

    bandTypes = [];
    bounceHelpers.getBandTypes = jest.fn(() => bandTypes);

    reshapedCategories = [];
    bounceHelpers.reshapeCategories = jest.fn(() => reshapedCategories);

    formattedAggregates = [];
    bounceHelpers.formatAggregates = jest.fn(() => formattedAggregates);
  });

  it('should map state to props when not loading', () => {
    const props = mapStateToProps(testState);
    expect(props).toEqual({
      chartLoading: false,
      tableLoading: false,
      reasons: testState.bounceReport.reasons,
      aggregates: formattedAggregates,
      categories: reshapedCategories,
      types: bandTypes,
      reportOptions: testState.reportOptions
    });
    expect(bounceHelpers.getBandTypes).toHaveBeenCalledWith(formattedAggregates);
    expect(bounceHelpers.reshapeCategories).toHaveBeenCalledWith(testState.bounceReport.classifications);
    expect(bounceHelpers.formatAggregates).toHaveBeenCalledWith(testState.bounceReport.aggregates);
  });

  it('should report chart and table as loading if aggregates are loading', () => {
    testState.bounceReport.aggregatesLoading = true;
    const props = mapStateToProps(testState);
    expect(props.chartLoading).toEqual(true);
    expect(props.tableLoading).toEqual(true);
  });

  it('should report chart and table as loading if categories are loading', () => {
    testState.bounceReport.categoriesLoading = true;
    const props = mapStateToProps(testState);
    expect(props.chartLoading).toEqual(true);
    expect(props.tableLoading).toEqual(true);
  });

  it('should report table as loading when reasons are loading', () => {
    testState.bounceReport.reasonsLoading = true;
    const props = mapStateToProps(testState);
    expect(props.chartLoading).toEqual(false);
    expect(props.tableLoading).toEqual(true);
  });

  it('should default to an empty array when there are no aggregates', () => {
    testState.bounceReport.aggregates = {};
    const props = mapStateToProps(testState);
    expect(props.aggregates).toEqual([]);
    expect(bounceHelpers.formatAggregates).not.toHaveBeenCalled();
  });

  it('should default to an empty array when there are no classifications', () => {
    delete testState.bounceReport.classifications;
    const props = mapStateToProps(testState);
    expect(props.categories).toBe(reshapedCategories);
    expect(bounceHelpers.reshapeCategories).toHaveBeenCalledWith([]);
  });

});
