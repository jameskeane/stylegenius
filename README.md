

### Setup
 1. Create and activate your virtual env
    ```
      python3 -m venv .venv
      source .venv/bin/activate
    ```
 2. Install deps
    ```
      pip install -r requirements.txt
    ```
 3. Create a local certificate:
    ```
       brew install mkcert
       mkcert -install
       mkcert -cert-file .venv/cert.pem -key-file .venv/key.pem localhost 127.0.0.1
    ```
 4. Create your .env file:
    ```
       TODO
    ```
 5. Run local server:
    ```
       python manage.py runserver_plus --cert-file .venv/cert.pem --key-file .venv/key.pem
    ```
