class CreateDoors < ActiveRecord::Migration[6.0]
  def change
    create_table :doors do |t|
      t.string :identification
      t.string :description

      t.timestamps
    end
  end
end
