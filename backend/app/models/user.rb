class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  # :recoverable, :rememberable, :validatable

  has_many :keys

  include Devise::JWT::RevocationStrategies::JTIMatcher

  enum roletype: { admin: 0, superuser: 1, user: 2 }

  default_scope { where("active = ?", true) }

  devise :database_authenticatable, 
         :registerable,
         :jwt_authenticatable,
         :trackable,
         jwt_revocation_strategy: self

  

end
