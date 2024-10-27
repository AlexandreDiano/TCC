class CreatePermissions < ActiveRecord::Migration[6.0]
  def change
    create_table :permissions do |t|
      t.references :key, null: false, foreign_key: true
      t.integer :day_of_week

      t.timestamps
    end
  end
end
