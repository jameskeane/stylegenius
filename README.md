

### Setup
 1. Add dev domain to 'hosts'
    ```
      sudo sh -c 'echo "127.0.0.1 dev.stylegeni.us" >> /etc/hosts'
    ```
 2. Create and activate your virtual env and node version
    ```
      python3 -m venv .venv
      source .venv/bin/activate
      nvm use
    ```
 3. Install deps
    ```
      pip install -r requirements.txt
    ```
 4. Create a local certificate:
    ```
       brew install mkcert
       mkcert -install
       mkcert -cert-file .venv/cert.pem -key-file .venv/key.pem dev.stylegeni.us 127.0.0.1
    ```
 5. Create your .env file:
    ```
       TODO
    ```
 6. Run dev environment:
    ```
       honcho start
    ```
