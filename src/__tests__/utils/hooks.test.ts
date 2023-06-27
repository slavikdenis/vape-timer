import { renderHook, act } from '@testing-library/react-hooks';
import { useScreenWakeLock, useVibrate } from '../../utils/hooks';

const vibrateMock = jest.fn();

describe('utility hooks', () => {
  beforeAll(() => {
    global.navigator.vibrate = vibrateMock;
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('useVibrate (pattern = 300)', () => {
    const { result } = renderHook(() => useVibrate());

    expect(result.current.isSupported).toBe(true);
    expect(typeof result.current.vibrate).toBe('function');

    act(() => {
      result.current.vibrate(300);
    });

    expect(vibrateMock).toBeCalledWith(300);
  });

  it('useVibrate (pattern = [100, 10, 100])', () => {
    const { result } = renderHook(() => useVibrate());

    expect(result.current.isSupported).toBe(true);
    expect(typeof result.current.vibrate).toBe('function');

    act(() => {
      result.current.vibrate([100, 10, 100]);
    });

    expect(vibrateMock).toBeCalledWith([100, 10, 100]);
  });

  it('useScreenWakeLock', async () => {
    const { result } = renderHook(() => useScreenWakeLock());

    expect(result.current.isSupported).toBe(true);
    expect(result.current.isLocked).toBe(false);

    await act(async () => {
      await result.current.lock();
    });

    expect(navigator.wakeLock.request).toHaveBeenCalledWith('screen');
    expect(result.current.isLocked).toBe(true);

    await act(async () => {
      await result.current.release();
    });
    expect(result.current.isLocked).toBe(false);
  });
});
