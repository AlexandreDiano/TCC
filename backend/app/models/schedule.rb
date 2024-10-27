class Schedule < ApplicationRecord
  belongs_to :permission
  validates :entry, :exit, presence: true

  def valid_now
    time_now = Time.current.change(year:2000, month:01, day:01)
    return (self.entry.change(year:2000, month:01, day:01) <= time_now && time_now <= self.exit.change(year:2000, month:01, day:01, sec:59))
  end

  #TODO:arrumar isso pra usar. COnfigurar o timezone
end
