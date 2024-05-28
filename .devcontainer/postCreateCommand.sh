#!/bin/bash

# Fix volume permissions
sudo chown -R $USER: node_modules

# Add git config
git config --global --add safe.directory /workspaces/odysseus-admin-story-tool

# Install dependencies
npm install --legacy-peer-deps
npm start