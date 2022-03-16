import {colors} from './colors';

export const mStyles = {
  container: {flex: 1},
  listContainer: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  centerScreen: {
    justifyContent: 'center',
    alignCenter: 'center',
  },
  displayInLine: {
    flexDirection: 'row',
  },
  centerVerticalInline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  page: {
    backgroundColor: colors.secondary,
    flex: 1,
  },
  content: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flex: 1,
    overflow: 'hidden',
  },
};
