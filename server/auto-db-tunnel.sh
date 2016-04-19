#!/bin/bash

# MS SQL Server
autossh -f -M 0  -i ~/.ssh/dolly_rsa -o "ServerAliveInterval 30" -L 8433:localhost:8433 -N jgr@84.91.3.12
# ide
autossh -f -M 0  -i ~/.ssh/dolly_rsa -o "ServerAliveInterval 30" -L 9433:10.1.1.10:5433 -N jgr@84.91.3.12
# publica (rede interna/servidor quebrado)
# autossh -f -M 0  -i ~/.ssh/dolly_rsa -o "ServerAliveInterval 30" -L 9432:10.1.1.8:5432 -N jgr@84.91.3.12
# publica@dolly
autossh -f -M 0  -i ~/.ssh/dolly_rsa -o "ServerAliveInterval 30" -L 9432:localhost:5432 -N jgr@84.91.3.12
