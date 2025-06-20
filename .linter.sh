#!/bin/bash
cd /home/kavia/workspace/code-generation/sharesplit-112672-9f2e9110/share_split_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

