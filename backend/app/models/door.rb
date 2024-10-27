class Door < ApplicationRecord
    validates :identification, presence: true, uniqueness: true
    has_many :keys

    scope :exists, ->(identification) { where("identification = ?", identification ) } 
end
