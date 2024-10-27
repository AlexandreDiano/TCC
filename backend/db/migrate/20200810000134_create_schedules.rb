class CreateSchedules < ActiveRecord::Migration[6.0]
  def change
    create_table :schedules do |t|
      t.datetime :entry
      t.datetime :exit
      t.references :permission, null: false, foreign_key: true

      t.timestamps
    end
  end
end
