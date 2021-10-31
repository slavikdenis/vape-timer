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

  it('useVibrate', () => {
    const { result } = renderHook(() => useVibrate());

    expect(result.current.isSupported).toBe(true);
    expect(typeof result.current.vibrate).toBe('function');

    act(() => {
      result.current.vibrate();
    });

    expect(vibrateMock).toBeCalledWith(300);
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

    act(async () => {
      result.current.release();
    });
    expect(result.current.isLocked).toBe(false);
  });
});