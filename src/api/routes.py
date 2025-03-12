"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Accounts, Account_details
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required,verify_jwt_in_request, decode_token
from flask_jwt_extended.exceptions import NoAuthorizationError
from flask_bcrypt import Bcrypt

api = Blueprint('api', __name__)
bcrypt = Bcrypt()

CORS(api)

        #este endpoint busca y muestra a todos los usuarios registrados
@api.route('/users', methods=['GET'])
def get_users():
    data = db.session.scalars(db.select(User)).all()
    result = list(map(lambda item: item.serialize(),data))
    if result == []:
        return jsonify({"msg":"Usuario no encontrado"}), 404
    response_body = {
        "results": result
    }
    return jsonify(response_body), 200

        #este endpoint busca un usuario especifico entre todos los demas
@api.route('/user/<int:user_id>', methods=['GET'])
def get_one_user(user_id):
    try:
        user = db.session.execute(db.select(User).filter_by(id=user_id)).scalar_one()
        return jsonify({"result":user.serialize()}), 200
    except:
        return jsonify({"msg":"Usuario o contraseña incorrecta"}), 404
    
    #este endpoint valida los datos de usuario y crea el token de acceso
@api.route("/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    try:
        user = db.session.execute(db.select(User).filter_by(email=email)).scalar_one()
        if not bcrypt.check_password_hash(user.password, password):
            return jsonify({"msg": "Bad email or password"}), 401
        access_token = create_access_token(identity=email)
        return jsonify(access_token=access_token)
    except:
        return jsonify({"msg": "this user does not exist"}), 404
    
        #este endpoin protege la ruta del usuario
@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

@api.route("/verify-token", methods=["GET"])
def verify_token():
    try:
        verify_jwt_in_request()  # Verifica la validez del token
        identity = get_jwt_identity()  # Obtiene el usuario del token
        return jsonify({"valid": True, "user": identity}), 200
    except NoAuthorizationError:
        return jsonify({"valid": False, "message": "Token inválido o no proporcionado"}), 401
        
        #este endpoint crea una cuenta con el  id del usuario  
@api.route('/<int:user_id>/new-account', methods=['POST'])
def post_account(user_id):
    try:
        request_body = request.json

        exist = db.session.query(db.select(Accounts).filter_by(name=request_body["name"]).exists()).scalar()
        if not exist: 
            new_account = Accounts(user_id=user_id, name=request_body["name"], balance=request_body["balance"], coin=request_body["coin"], type=request_body["type"])
            db.session.add(new_account)
            db.session.commit()  
            return jsonify(request_body), 200
        else:
            return jsonify({"msg": "Account already exist"}), 404
    except Exception as e:
        return jsonify({"msg":"Error", "error": str(e)}), 500
    
        #este endpint muestra todas cuentas en general
@api.route('/accounts', methods=['GET'])
def get_accounts():
    data = db.session.scalars(db.select(Accounts)).all()
    result = list(map(lambda item: item.serialize(),data))
    if result == []:
        return jsonify({"msg":"no accounts, please create one"}), 404
    response_body = {
        "results": result
    }
    return jsonify(response_body), 200

        # este endpoin busca la lista de cuentas y muestra una sola cuenta especifica
@api.route('/accounts/<int:accounts_id>', methods=['GET'])
def get_one_accounts(accounts_id):
    try:
        account = db.session.execute(db.select(Accounts).filter_by(id=accounts_id)).scalar_one()
        return jsonify({"result":account.serialize()}), 200
    except:
        return jsonify({"msg":"account not found"}), 404
    
         #este endpoint valida si existe el usuario y muestra las cuentas de un usuario especifico
@api.route('/user/<int:user_id>/accounts', methods=['GET'])
def get_one_account_to_one_user(user_id):
    try:
        exist = db.session.query(db.select(Accounts).filter_by(user_id=user_id).exists()).scalar()
        if exist:
            accounts = db.session.execute(
                db.select(Accounts).filter_by(user_id=user_id).order_by(Accounts.id)  # Ordenar por ID
            ).scalars().all()
            if accounts != []:
                return jsonify({"result": [acc.serialize() for acc in accounts]}), 200
            return jsonify({"msg": "No accounts to show"})
        else:
            return jsonify({"msg": "user doesn't exist"}), 404
        
    except Exception as e:
        return jsonify({"msg":"Error", "error": str(e)}), 500


# registro usuario
@api.route("/signup", methods=["POST"])
def signup():
    body = request.json
    # para manejo de errores poner exactamente el nombre del front igual en los campos entre parentesis (esperar a que se haga el front)
    if not body or not body.get("email") or not body.get("password") or not body.get("last_name")or not body.get("first_name"):
        return jsonify({"msg": "missing fields"}), 400
    hashe_password = bcrypt.generate_password_hash(body["password"]).decode("utf-8")
    # encajar con los nombres del front estos (solo los que estan entre comillas)
    new_user = User(email = body["email"],password=hashe_password, last_name= body["last_name"],first_name= body["first_name"])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg": "user created"}), 201

#endpoint que crea un nuevo movimiento en una cuenta
@api.route('/new-account-detail/<int:accounts_id>', methods=['POST'])
def post_account_detail(accounts_id):
    try:
        request_body = request.json
        new_account_detail = Account_details(accounts_id=accounts_id, detail=request_body["detail"], amount=request_body["amount"], coin=request_body["coin"], type=request_body["type"],date=request_body["date"],time=request_body["time"],operation=request_body["operation"])
        db.session.add(new_account_detail)
        db.session.commit()  
        return jsonify(request_body), 200
    
    except:
        return jsonify({"msg":"miss information"}), 400
#endpoint que muestra uno o varios detalles de una cuenta especifica
@api.route('/account-detail/<int:accounts_id>', methods=['GET'])
def get_accounts_details(accounts_id):
    try:
        account_details = db.session.execute(
            db.select(Account_details)
            .filter_by(accounts_id=accounts_id)
            .order_by(Account_details.date.desc(), Account_details.time.desc())
        ).scalars().all()

        if account_details:
            return jsonify({"result": [acc.serialize() for acc in account_details]}), 200

        return jsonify({"msg": "No accounts to show"}), 404

    except Exception as e:
        return jsonify({"msg": "account not found", "error": str(e)}), 404


#endpoint que suma al balance de la cuenta 
@api.route('/accounts/<int:account_id>/deposit', methods=['PUT'])
def deposit(account_id):
    try:
        body = request.json
        account = db.session.execute(db.select(Accounts).filter_by(id=account_id)).scalar_one()
        if "amount" in body:
            account.balance = account.balance + body["amount"]
        db.session.commit()
        return jsonify({"msg": "account updated"}), 200
    except:
        return jsonify({"msg": "internal server error"}), 500

#endpoint que resta del balance de la cuenta 
@api.route('/accounts/<int:account_id>/debit', methods=['PUT'])
def Debit(account_id):
    try:
        body = request.json
        account = db.session.execute(db.select(Accounts).filter_by(id=account_id)).scalar_one()
        if "amount" in body:
            account.balance = account.balance - body["amount"] 
        db.session.commit()
        return jsonify({"msg": "account updated"}), 200
    except:
        return jsonify({"msg": "internal server error"}), 500
    
# endpoint delete cuenta (de gastos)
@api.route("/accounts/<int:account_id>", methods=["DELETE"])
def delete_account(account_id):
    try:
        account = Accounts.query.get(account_id)
        if not account:
            return jsonify({"msg": "account not found"}), 404

        db.session.delete(account)
        db.session.commit()
        return jsonify({"msg": "account deleted"}), 200
    except:
        return jsonify({"msg": "internal server error"}), 500

# endpoint editar cuenta (de gastos)
@api.route('/accounts/<int:account_id>', methods=['PUT'])
def update_account(account_id):
    try:
        body = request.json
        account = db.session.execute(db.select(Accounts).filter_by(id=account_id)).scalar_one()
        if not account:
            return jsonify({"msg": "account not found"}), 404
        if "name" in body:
            account.name = body["name"]
        if "balance" in body:
            account.balance = body["balance"]
        if "coin" in body:
            account.coin = body["coin"]
        if "type" in body:
            account.type = body["type"]
        db.session.commit()
        return jsonify({"msg": "account updated"}), 200

    except:
        return jsonify({"msg": "internal server error"}), 500


# endpoint editar movimiento de cuenta
@api.route('/account-detail/<int:account_detail_id>', methods=['PUT'])
def update_account_detail(account_detail_id):
    try:
        body = request.json
        movement = db.session.execute(db.select(Account_details).filter_by(id=account_detail_id)).scalar_one_or_none()
        if not movement:
            return jsonify({"msg": "Movement not found"}), 404
        account = db.session.execute(db.select(Accounts).filter_by(id=movement.accounts_id)).scalar_one_or_none()
        if not account:
            return jsonify({"msg": "Account not found"}), 404

        # Esto es para que el balance no sume dos veces, primero se borra lo anterior
        if movement.type == "deposit":
            account.balance = account.balance - movement.amount
        else:
            if movement.type == "debit":
                account.balance = account.balance + movement.amount
        # Se cambia lo que llega en el body
        if "detail" in body:
            movement.detail = body["detail"]
        if "amount" in body:
            movement.amount = body["amount"]
        if "coin" in body:
            movement.coin = body["coin"]
        if "type" in body:
            movement.type = body["type"]
        if "date" in body:
            movement.date = body["date"]
        if "time" in body:
            movement.time = body["time"]
        # Ahora se vuelve a hacer la operación con los datos nuevos
        if movement.type == "deposit":
            account.balance = account.balance + movement.amount
        else:
            if movement.type == "debit":
                account.balance = account.balance - movement.amount
        db.session.commit()
        return jsonify({"msg": "Movement updated and balance adjusted"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Internal server error"}), 500
# fin endpoint editar movimiento de cuenta

# endpoint eliminar movimiento
@api.route('/account-detail/<int:account_detail_id>', methods=['DELETE'])
def delete_account_detail(account_detail_id):
    try:
        movement = db.session.execute(db.select(Account_details).filter_by(id=account_detail_id)).scalar_one_or_none()
        if not movement:
            return jsonify({"msg": "Movement not found"}), 404
        account = db.session.execute(db.select(Accounts).filter_by(id=movement.accounts_id)).scalar_one_or_none()
        if not account:
            return jsonify({"msg": "Account not found"}), 404
        # resta si es en
        if movement.type == "deposit":
            account.balance -= movement.amount  
        # suma si es en debito
        if movement.type == "debit":
            account.balance += movement.amount  
        db.session.delete(movement)  
        db.session.commit()
        return jsonify({"msg": "Movement deleted"}), 200

    except:
        db.session.rollback()
        return jsonify({"msg": "Internal server error"}), 500
# fin endpoint elinimar movimiento de cuenta

#endpoint colsulta todos los movimientos de 1 usuario
@api.route('/all-details-user/<int:user_id>', methods=['GET'])
def get_details_user(user_id):
    try:
        user_accounts = db.session.execute(
            db.select(Accounts).filter_by(user_id=user_id)
        ).scalars().all()

        accounts_id = [account.id for account in user_accounts]

        if not accounts_id:
            return jsonify({"msg": "El usuario no tiene cuentas asociadas"}), 404

        details = db.session.execute(
            db.select(Account_details)
            .filter(Account_details.accounts_id.in_(accounts_id))
            .order_by(Account_details.date.desc(), Account_details.time.desc())  # Orden por fecha y hora descendente
        ).scalars().all()
        

        if details:
            return jsonify({"result": [detail.serialize() for detail in details]}), 200
        return jsonify({"msg": "No hay movimientos para este usuario"}), 404

    except Exception as e:
        return jsonify({"msg": "Error en la consulta"}), 500
