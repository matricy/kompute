import keyring


def create_token_in_keyring(service_name: str, username: str, password: str) -> None:
    keyring.set_password(service_name, username, password)


def delete_token_from_keyring(service_name: str, username: str) -> None:
    keyring.delete_password(service_name, username)
