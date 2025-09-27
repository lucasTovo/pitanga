CommonName="localhost"

CERT_PATH=./core/src/main/resources/certs
if (!(test -d $CERT_PATH)); then
    mkdir $CERT_PATH;
fi

KEY_PATH="$CERT_PATH/key.pem"
CERT_PATH="$CERT_PATH/certificate.pem"

if (!(test -d ./core/src/main/resources/certs)); then
    mkdir ./core/src/main/resources/certs
fi

if (!(test -e $CERT_PATH)); then
    openssl req -x509 -newkey rsa:4096 -nodes -keyout $KEY_PATH -out $CERT_PATH \
        -sha256 -days 3650 -nodes \
        -subj "/C=BR/ST=RioGrandeDoSul/L=PortoAlegre/O=IFRSPitanga/OU=TI/CN=$CommonName"

    keytool -delete -cacerts -alias  pitanga -storepass $STORE_PASS
    keytool -importcert -cacerts -file $CERT_PATH -alias pitanga -storepass $STORE_PASS

    sudo chmod og+r $KEY_PATH
    docker compose up -d --build keycloak
fi

docker compose up -d postgres keycloak

export SHOW_SQL=false
export DB_URL="jdbc:postgresql://localhost:5432/challenges_pitanga"
export DB_PASSWORD="mysecretpassword"
export DB_USERNAME="postgres"
export ISSUER_URI="https://localhost:8444/realms/pitanga"
export JWK_SET_URI="https://localhost:8444/realms/pitanga/protocol/openid-connect/certs"

cd ./core
./mvnw clean package
cd ..

cp ./core/target/*.jar ./app.jar
