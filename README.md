It is a helper script that produces CSV output with account owned balance, lockup locked balance, lockup total balance, and lockup liquid balance.

You will need Node.js to run the script.

Install project dependencies:

```sh
npm install
```

Operate the script:

1. Edit `blockReference` value in `script.js` file
2. Run the script:

    ```sh
    node script.js 2>/dev/null >output.txt
    ```
3. CSV output will be saved to `output.txt` file and errors will be ignored (remove `2>/dev/null` to see all the errors)
