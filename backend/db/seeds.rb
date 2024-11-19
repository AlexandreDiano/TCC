# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
require 'faker'
# 3 Adms no mesmo dominio 1
User.create(username: "admin1", password:"senhaadmin1", name: Faker::Name.first_name, surname: Faker::Name.last_name, email: Faker::Internet.email, cpf: Faker::Number.number(digits:11), active: true, roletype: 0, domain: 1)
User.create(username: "admin2", password:"senhaadmin2", name: Faker::Name.first_name, surname: Faker::Name.last_name, email: Faker::Internet.email, cpf: Faker::Number.number(digits:11), active: true, roletype: 0, domain: 1)
User.create(username: "admin3", password:"senhaadmin3", name: Faker::Name.first_name, surname: Faker::Name.last_name, email: Faker::Internet.email, cpf: Faker::Number.number(digits:11), active: true, roletype: 0, domain: 1)
# 4 superusuarios em 3 dominios
superuser1 = User.create(username: "superuser1", password:"senhasuperuser1", name: Faker::Name.first_name, surname: Faker::Name.last_name, email: Faker::Internet.email, cpf: Faker::Number.number(digits:11), active: true, roletype: 1, domain: 2)
superuser2 = User.create(username: "superuser2", password:"senhasuperuser2", name: Faker::Name.first_name, surname: Faker::Name.last_name, email: Faker::Internet.email, cpf: Faker::Number.number(digits:11), active: true, roletype: 1, domain: 2)
superuser3 = User.create(username: "superuser3", password:"senhasuperuser3", name: Faker::Name.first_name, surname: Faker::Name.last_name, email: Faker::Internet.email, cpf: Faker::Number.number(digits:11), active: true, roletype: 1, domain: 3)
superuser4 = User.create(username: "superuser4", password:"senhasuperuser4", name: Faker::Name.first_name, surname: Faker::Name.last_name, email: Faker::Internet.email, cpf: Faker::Number.number(digits:11), active: true, roletype: 1, domain: 4)
# 3 usuarios no dominio 2
user1 = User.create(username: "user1", password:"senhauser1", name: Faker::Name.first_name, surname: Faker::Name.last_name, email: Faker::Internet.email, cpf: Faker::Number.number(digits:11), active: true, roletype: 2, domain: 2)
user2 = User.create(username: "user2", password:"senhauser2", name: Faker::Name.first_name, surname: Faker::Name.last_name, email: Faker::Internet.email, cpf: Faker::Number.number(digits:11), active: true, roletype: 2, domain: 2)
user3 = User.create(username: "user3", password:"senhauser3", name: Faker::Name.first_name, surname: Faker::Name.last_name, email: Faker::Internet.email, cpf: Faker::Number.number(digits:11), active: true, roletype: 2, domain: 2)
# 3 usuarios no dominio 3
user4 = User.create(username: "user4", password:"senhauser4", name: Faker::Name.first_name, surname: Faker::Name.last_name, email: Faker::Internet.email, cpf: Faker::Number.number(digits:11), active: true, roletype: 2, domain: 3)
user5 = User.create(username: "user5", password:"senhauser5", name: Faker::Name.first_name, surname: Faker::Name.last_name, email: Faker::Internet.email, cpf: Faker::Number.number(digits:11), active: true, roletype: 2, domain: 3)
user6 = User.create(username: "user6", password:"senhauser6", name: Faker::Name.first_name, surname: Faker::Name.last_name, email: Faker::Internet.email, cpf: Faker::Number.number(digits:11), active: true, roletype: 2, domain: 3)
# 2 usuarios no dominio 4
user7 = User.create(username: "user7", password:"senhauser7", name: Faker::Name.first_name, surname: Faker::Name.last_name, email: Faker::Internet.email, cpf: Faker::Number.number(digits:11), active: true, roletype: 2, domain: 4)
user8 = User.create(username: "user8", password:"senhauser8", name: Faker::Name.first_name, surname: Faker::Name.last_name, email: Faker::Internet.email, cpf: Faker::Number.number(digits:11), active: true, roletype: 2, domain: 4)
####Usuario do domino 4 ainda sem nada cadastrado
user9 = User.create(username: "user9", password:"senhauser9", name: Faker::Name.first_name, surname: Faker::Name.last_name, email: Faker::Internet.email, cpf: Faker::Number.number(digits:11), active: true, roletype: 2, domain: 4)
user10 = User.create(username: "user10", password:"senhauser10", name: Faker::Name.first_name, surname: Faker::Name.last_name, email: Faker::Internet.email, cpf: Faker::Number.number(digits:11), active: true, roletype: 2, domain: 4)

# 2 portas no dominio 2
porta1 = Door.create(identification: '13cf6ea93089f291b6093a30aae62d46' , description: "porta1" , domain: 2)
porta2 = Door.create(identification: '23cf6ea93089f291b6093a30aae62d46' , description: "porta2" , domain: 2)
# 2 portas no dominio 3
porta3 = Door.create(identification: '33cf6ea93089f291b6093a30aae62d46', description: "porta3" , domain: 3)
porta4 = Door.create(identification: '43cf6ea93089f291b6093a30aae62d46' , description: "porta4" , domain: 3)
# 1 porta no dominio 4
porta5 = Door.create(identification: '53cf6ea93089f291b6093a30aae62d46' , description: "porta5" , domain: 4)
# 3 portas ainda sem dominio
Door.create(identification: '63cf6ea93089f291b6093a30aae62d46')
Door.create(identification: '73cf6ea93089f291b6093a30aae62d46')
Door.create(identification: '83cf6ea93089f291b6093a30aae62d46')

#Chave do super usuario 1 para as portas 1 e 2
code = '016a0edf6cc'
Key.create(code: code, description: "SU1P1", user: superuser1, door: porta1)
Key.create(code: code, description: "SU1P2", user: superuser1, door: porta2)
#Chave do super usuario 2 para as portas 1 e 2
code = '026a0edf6cc'
Key.create(code: code, description: "SU2P1", user: superuser2, door: porta1)
Key.create(code: code, description: "SU2P2", user: superuser2, door: porta2)

#Chave do super usuario 3 para as portas 3 e 4
code = '036a0edf6cc'
Key.create(code: code, description: "SU3P3", user: superuser3, door: porta3)
Key.create(code: code, description: "SU3P4", user: superuser3, door: porta4)

#Chave do super usuario 2 para a porta 5
code = '046a0edf6cc'
Key.create(code: code, description: "SU4P5", user: superuser4, door: porta5)

#usuarios e portas do dominio 2
code = '056a0edf6cc'
Key.create(code: code, description: "U1P1", user: user1, door: porta1)
Key.create(code: code, description: "U1P2", user: user1, door: porta2)
code = '066a0edf6cc'
Key.create(code: code, description: "U2P1", user: user2, door: porta1)
code = '076a0edf6cc'
Key.create(code: code, description: "U3P2", user: user3, door: porta2)

#usuarios e portas do dominio 3
code = '086a0edf6cc'
Key.create(code: code, description: "U4P1", user: user4, door: porta3)
Key.create(code: code, description: "U4P2", user: user4, door: porta4)
code = '096a0edf6cc'
Key.create(code: code, description: "U5P1", user: user5, door: porta3)
code = '106a0edf6cc'
Key.create(code: code, description: "U6P2", user: user6, door: porta4)

#usuarios e portas do dominio 4
code = '116a0edf6cc'
Key.create(code: code, description: "U7P1", user: user7, door: porta5)
code = '126a0edf6cc'
Key.create(code: code, description: "U8P2", user: user8, door: porta5)


#Duas Chaves sem associacao
code = '136a0edf6cc'
Key.create(code: code, description: "", door: porta5)
code = '146a0edf6cc'
Key.create(code: code, description: "", door: porta5)

#preencher schedule para algumas chaves
permission = Permission.find(1)
time = Time.current
Schedule.create(permission: permission, entry: time.change(hour: 8, min:30), exit:time.change(hour: 12, min:0))
Schedule.create(permission: permission, entry: time.change(hour: 13, min:0), exit:time.change(hour: 18, min:0))

permission = Permission.find(2)
Schedule.create(permission: permission, entry: time.change(hour: 8, min:30), exit:time.change(hour: 12, min:0))
Schedule.create(permission: permission, entry: time.change(hour: 13, min:0), exit:time.change(hour: 18, min:0))

permission = Permission.find(3)
Schedule.create(permission: permission, entry: time.change(hour: 8, min:30), exit:time.change(hour: 12, min:0))
Schedule.create(permission: permission, entry: time.change(hour: 13, min:0), exit:time.change(hour: 18, min:0))

permission = Permission.find(5)
Schedule.create(permission: permission, entry: time.change(hour: 18, min:0), exit:time.change(hour: 23, min:0))

permission = Permission.find(6)
Schedule.create(permission: permission, entry: time.change(hour: 8, min:30), exit:time.change(hour: 12, min:0))

users = User.where(domain: 2)
doors = Door.where(domain: 2)
(0..20).each do |day|
    rand = Random.new.rand(10)
    (0..rand).each do |acc|
    Access.create(user: users[Random.new.rand(30) % users.count], 
        door: doors[Random.new.rand(30) % doors.count], 
        type_access: "Entrada", created_at: DateTime.now + 2.days - day.days)
    end
end