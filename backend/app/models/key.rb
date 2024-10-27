class Key < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :door, optional: true
  has_many :permissions, dependent: :destroy

  after_create :create_permissions

  private

  def create_permissions
    day = -1

    7.times {
      Permission.create(key: self, day_of_week: day += 1)
    }     
    self.save!
  end

end
