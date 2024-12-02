import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be tskv: log', () => {
    const addMock = jest.spyOn(console, 'log').mockImplementation(() => {});
    const message = 'tskv log test text';
    const optionalParams = 'params text';
    logger.log(message, optionalParams);
    const expected = `level=log\tmessage=${message}\toptionalParams=${optionalParams}\n`;
    expect(addMock).toHaveBeenCalledWith(expected);
  });

  it('should be tskv: error', () => {
    const addMock = jest.spyOn(console, 'error').mockImplementation(() => {});
    const message = 'tskv error test text';
    const optionalParams = 'params text';
    logger.error(message, optionalParams);
    const expected = `level=error\tmessage=${message}\toptionalParams=${optionalParams}\n`;
    expect(addMock).toHaveBeenCalledWith(expected);
  });

  it('should be tskv: warn', () => {
    const addMock = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const message = 'tskv warning test text';
    const optionalParams = 'params text';
    logger.warn(message, optionalParams);
    const expected = `level=warn\tmessage=${message}\toptionalParams=${optionalParams}\n`;
    expect(addMock).toHaveBeenCalledWith(expected);
  });
});
