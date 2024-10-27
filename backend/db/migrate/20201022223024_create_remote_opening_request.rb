class CreateRemoteOpeningRequest < ActiveRecord::Migration[6.0]
  def change
    create_table :remote_opening_requests do |t|
      t.references :user, null: false, foreign_key: true
      t.references :door, null: false, foreign_key: true
      
      t.timestamps
    end
  end
end
