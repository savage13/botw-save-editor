git describe --tags | awk '{print "export const VERSION = \""$1"\";"}'
