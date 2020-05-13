#Peer-Manager

manages peer depedencies across packages

This package acts as a central authority to peer dependencies across packages used together as a singular app/library.  That way there is a single source for what should be peer dependencies instead of one package having different peers than another and becoming a confusing mess.

Right now it will check against an internal peer dependencies list.